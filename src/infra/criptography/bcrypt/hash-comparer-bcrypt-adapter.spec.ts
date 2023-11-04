import bcrypt from 'bcrypt'
import { HashComparerBcryptAdapter } from './hash-compare-bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const makeSut = (): HashComparerBcryptAdapter => {
  return new HashComparerBcryptAdapter()
}

describe('HashComparerBcryptAdapter', () => {
  test('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true if compare succeeds', async () => {
    const sut = makeSut()
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(true)
  })

  test('Should return false if compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      return false
    })
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(false)
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
