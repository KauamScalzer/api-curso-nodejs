import { Hasher } from '../../protocols/criptography'
import { CreateUserUsecase } from './create-user-usecase'
import { CreateUserModel } from '../../../domain/usecases/user'
import { UserModel } from '../../../domain/models'
import { CreateUserRepository } from '../../protocols/user'

interface SutTypes {
  sut: CreateUserUsecase
  hasherStub: Hasher
  createUserRepositoryStub: CreateUserRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
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
  const hasherStub = makeHasher()
  const createUserRepositoryStub = makeCreateUserRepository()
  const sut = new CreateUserUsecase(hasherStub, createUserRepositoryStub)
  return {
    sut,
    hasherStub,
    createUserRepositoryStub
  }
}

describe('CreateUserUsecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.create(makeFakeUserData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
