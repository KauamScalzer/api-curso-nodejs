import * as bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/criptography'

export class HashComparerBcryptAdapter implements HashComparer {
  async compare (value: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hash)
    return result
  }
}
