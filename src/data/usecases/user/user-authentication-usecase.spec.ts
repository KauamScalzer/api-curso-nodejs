import { UserModel } from 'domain/models'
import { UserAuthenticationUsecase } from './user-authentication-usecase'
import { GetOneUserByEmailRepository } from 'data/protocols/user'
import { UserAuthenticationModel } from 'domain/usecases/user'
import { HashComparer } from 'data/protocols/criptography'

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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

interface SutTypes {
  sut: UserAuthenticationUsecase
  getOneUserByEmailRepositoryStub: GetOneUserByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const getOneUserByEmailRepositoryStub = makeGetOneUserByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const sut = new UserAuthenticationUsecase(getOneUserByEmailRepositoryStub, hashComparerStub)
  return {
    sut,
    getOneUserByEmailRepositoryStub,
    hashComparerStub
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

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationData())
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })
})
