import { EmailValidator } from '../../protocols'
import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (data: any): Error | undefined {
    const isValid = this.emailValidator.isValid(data[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
