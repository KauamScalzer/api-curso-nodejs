import * as bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography'

export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (value: string): Promise<string> {
    const result = await bcrypt.hash(value, this.salt)
    return result
  }
}
