import { EmailValidatorAdapter } from '../../../adapters/validators'
import { ValidationComposite, RequiredFieldValidation, Validation, EmailValidation } from '../../../../presentation/helpers/validators'

export const makeUserAuthenticationValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
