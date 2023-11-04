import { UserModel } from 'domain/models'
import { UserAuthenticationUsecase } from './user-authentication-usecase'
import { GetOneUserByEmailRepository } from 'data/protocols/user'
import { UserAuthenticationModel } from 'domain/usecases/user'

const makeGetOneUserByEmailRepository = (): GetOneUserByEmailRepository => {
  class GetOneUserByEmailRepositoryStub implements GetOneUserByEmailRepository {
    async getOne (data: string): Promise<UserModel | null> {
      const fakeUser: UserModel = {
        id: 1,
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }
      return await new Promise(resolve => resolve(fakeUser))
    }
  }
  return new GetOneUserByEmailRepositoryStub()
}

interface SutTypes {
  sut: UserAuthenticationUsecase
  getOneUserByEmailRepositoryStub: GetOneUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const getOneUserByEmailRepositoryStub = makeGetOneUserByEmailRepository()
  const sut = new UserAuthenticationUsecase(getOneUserByEmailRepositoryStub)
  return {
    sut,
    getOneUserByEmailRepositoryStub
  }
}

const makeFakeAuthenticationData = (): UserAuthenticationModel => ({
  email: 'valid_email',
  password: 'valid_password'
})

describe('UserAuthenticationUsecase', () => {
  test('Should call GetOneUserByEmailRepository with correct email', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    const getOneSpy = jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne')
    await sut.auth(makeFakeAuthenticationData())
    expect(getOneSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if GetOneUserByEmailRepository throws', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetOneUserByEmailRepository returns null', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockResolvedValueOnce(null)
    const result = await sut.auth(makeFakeAuthenticationData())
    expect(result).toBeFalsy()
  })
})
