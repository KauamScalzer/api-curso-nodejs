import { UserModel } from 'domain/models'
import { UserAuthenticationUsecase } from './user-authentication-usecase'
import { GetOneUserByEmailRepository } from 'data/protocols/user'

const makeGetOneUserByEmailRepository = (): GetOneUserByEmailRepository => {
  class GetOneUserByEmailRepositoryStub implements GetOneUserByEmailRepository {
    async getOne (data: string): Promise<UserModel> {
      return await new Promise(resolve => resolve({
        id: 1,
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }))
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

describe('UserAuthenticationUsecase', () => {
  test('Should call GetOneUserByEmailRepository with correct email', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    const getOneSpy = jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne')
    await sut.auth({ email: 'valid_email', password: 'valid_password' })
    expect(getOneSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if GetOneUserByEmailRepository throws', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth({ email: 'valid_email', password: 'valid_password' })
    await expect(promise).rejects.toThrow()
  })
})
