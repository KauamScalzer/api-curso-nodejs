import { EmailValidatorAdapter } from '../../../adapters/validators'
import { ValidationComposite, RequiredFieldValidation, Validation, CompareFieldValidation, EmailValidation } from '../../../../presentation/helpers/validators'

export const makeCreateUserValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
