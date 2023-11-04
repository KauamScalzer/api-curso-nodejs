import { Encrypter } from '../../protocols/encrypter'
import { CreateUserUsecase } from './create-user-usecase'
import { CreateUserModel } from '../../../domain/usecases/user'
import { UserModel } from '../../../domain/models'
import { CreateUserRepository } from '../../protocols/user'

interface SutTypes {
  sut: CreateUserUsecase
  encrypterStub: Encrypter
  createUserRepositoryStub: CreateUserRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create (data: CreateUserModel): Promise<UserModel> {
      return makeFakeUser()
    }
  }
  return new CreateUserRepositoryStub()
}

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeUserData = (): CreateUserModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const createUserRepositoryStub = makeCreateUserRepository()
  const sut = new CreateUserUsecase(encrypterStub, createUserRepositoryStub)
  return {
    sut,
    encrypterStub,
    createUserRepositoryStub
  }
}

describe('CreateUserUsecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.create(makeFakeUserData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.create(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateUserRepository with correct values', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createUserRepositoryStub, 'create')
    await sut.create(makeFakeUserData())
    expect(createSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    jest.spyOn(createUserRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.create(makeFakeUserData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an user on sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.create(makeFakeUserData())
    expect(result).toEqual(makeFakeUser())
  })
})
