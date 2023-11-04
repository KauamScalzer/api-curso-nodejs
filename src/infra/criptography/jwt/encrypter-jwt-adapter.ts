import jwt from 'jsonwebtoken'
import { Encrypter } from 'data/protocols/criptography'

export class EncrypterJwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const result = await jwt.sign({ id: value }, this.secret)
    return result
  }
}
