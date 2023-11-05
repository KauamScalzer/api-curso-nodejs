import { RequiredFieldValidation, Validation } from '../../../../presentation/helpers/validators'
import { makeUserAuthenticationValidation } from './user-authentication-validation-factory'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../../../presentation/protocols'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('UserAuthenticationValidation factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUserAuthenticationValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})