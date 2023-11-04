import { UserModel } from 'domain/models'
import { UserAuthenticationUsecase } from './user-authentication-usecase'
import { GetOneUserByEmailRepository, UpdateUserRepository, UpdateUserRepositoryParams } from 'data/protocols/user'
import { UserAuthenticationModel } from 'domain/usecases/user'
import { HashComparer, TokenGenerator } from 'data/protocols/criptography'

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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: number): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateUserRepository = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async update (id: number, data: UpdateUserRepositoryParams): Promise<void> {}
  }
  return new UpdateUserRepositoryStub()
}

interface SutTypes {
  sut: UserAuthenticationUsecase
  getOneUserByEmailRepositoryStub: GetOneUserByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateUserRepositoryStub: UpdateUserRepository
}

const makeSut = (): SutTypes => {
  const getOneUserByEmailRepositoryStub = makeGetOneUserByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateUserRepositoryStub = makeUpdateUserRepository()
  const sut = new UserAuthenticationUsecase(getOneUserByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateUserRepositoryStub)
  return {
    sut,
    getOneUserByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateUserRepositoryStub
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

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationData())
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'hashed_password')
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthenticationData())
    expect(generateSpy).toHaveBeenCalledWith(1)
  })

  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'update')
    await sut.auth(makeFakeAuthenticationData())
    expect(updateSpy).toHaveBeenCalledWith(1, { acessToken: 'any_token' })
  })

  test('Should throw if GetOneUserByEmailRepository throws', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetOneUserByEmailRepository returns null', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockResolvedValueOnce(null)
    const result = await sut.auth(makeFakeAuthenticationData())
    expect(result).toBeFalsy()
  })

  test('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const result = await sut.auth(makeFakeAuthenticationData())
    expect(result).toBeFalsy()
  })

  test('Should return an acessToken on sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.auth(makeFakeAuthenticationData())
    expect(result).toBe('any_token')
  })
})
