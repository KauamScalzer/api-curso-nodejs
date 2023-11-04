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

  test('Should return true on sucess', async () => {
    const sut = makeSut()
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(true)
  })
})
