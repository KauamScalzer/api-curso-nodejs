import { CompareFieldValidation, RequiredFieldValidation, Validation } from '../../../presentation/helpers/validators'
import { makeCreateUserValidation } from './create-user-validation-factory'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../../presentation/protocols'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('CreateUserValidation factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeCreateUserValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
