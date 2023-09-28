import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect('MONGODB_URI', {
    })
  },

  async disconnect () {
    await this.client.close()
  }
}
