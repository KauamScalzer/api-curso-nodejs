import { UserModel } from 'domain/models'
import { UserAuthenticationUsecase } from './user-authentication-usecase'
import { GetOneUserByEmailRepository, UpdateUserRepository, UpdateUserRepositoryParams } from 'data/protocols/user'
import { UserAuthenticationModel } from 'domain/usecases/user'
import { HashComparer, Encrypter } from 'data/protocols/criptography'

const makeGetOneUserByEmailRepository = (): GetOneUserByEmailRepository => {
  class GetOneUserByEmailRepositoryStub implements GetOneUserByEmailRepository {
    async getOne (data: string): Promise<UserModel | undefined> {
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
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
  encrypterStub: Encrypter
  updateUserRepositoryStub: UpdateUserRepository
}

const makeSut = (): SutTypes => {
  const getOneUserByEmailRepositoryStub = makeGetOneUserByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateUserRepositoryStub = makeUpdateUserRepository()
  const sut = new UserAuthenticationUsecase(getOneUserByEmailRepositoryStub, hashComparerStub, encrypterStub, updateUserRepositoryStub)
  return {
    sut,
    getOneUserByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
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

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationData())
    expect(generateSpy).toHaveBeenCalledWith('1')
  })

  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'update')
    await sut.auth(makeFakeAuthenticationData())
    expect(updateSpy).toHaveBeenCalledWith(1, { accessToken: 'any_token' })
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

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut()
    jest.spyOn(updateUserRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if GetOneUserByEmailRepository returns null', async () => {
    const { sut, getOneUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(getOneUserByEmailRepositoryStub, 'getOne').mockResolvedValueOnce(undefined)
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
