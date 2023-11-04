export interface UpdateUserRepository {
  update (id: number, data: UpdateUserRepositoryParams): Promise<void>
}

export interface UpdateUserRepositoryParams {
  name?: string
  email?: string
  password?: string
  accessToken?: string
}
