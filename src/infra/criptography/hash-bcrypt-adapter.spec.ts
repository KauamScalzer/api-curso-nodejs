import bcrypt from 'bcrypt'
import { HashBcryptAdapter } from './hash-bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash () {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12

const makeSut = (): HashBcryptAdapter => {
  return new HashBcryptAdapter(salt)
}

describe('HashBcryptAdapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
