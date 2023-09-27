import { EmailValidatorAdapter } from './EmailValidator'
import validator from 'validator'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', async () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})
