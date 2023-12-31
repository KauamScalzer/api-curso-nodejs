import { Encrypter } from 'data/protocols/encrypter/encrypter'
import { DbCreateAccount } from './DbCreateAccount'
import { CreateAccountModel } from 'domain/usecases/account'
import { AccountModel } from 'domain/models'
import { CreateAccountRepository } from 'data/protocols/account'

interface SutTypes {
  sut: DbCreateAccount
  encrypterStub: Encrypter
  createAccountRepositoryStub: CreateAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create (data: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return fakeAccount
    }
  }
  return new CreateAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const createAccountRepositoryStub = makeCreateAccountRepository()
  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    createAccountRepositoryStub
  }
}

describe('DbCreateAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.create(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createAccountRepositoryStub, 'create')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(createSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if CreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    jest.spyOn(createAccountRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.create(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const result = await sut.create(accountData)
    expect(result).toEqual({
      id: 1,
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
