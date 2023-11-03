import { RequiredFieldValidation, Validation } from '../../../presentation/helpers/validators'
import { makeCreateUserValidation } from './create-user-validation-factory'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('CreateUserValidation factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeCreateUserValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
