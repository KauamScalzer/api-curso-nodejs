import * as bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography'

export class HashBcryptAdapter implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    const result = await bcrypt.hash(value, this.salt)
    return result
  }
}
