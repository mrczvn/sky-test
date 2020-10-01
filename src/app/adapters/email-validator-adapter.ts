import validator from 'validator'
import { IEmailValidator } from '@/helpers/interfaces'

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
