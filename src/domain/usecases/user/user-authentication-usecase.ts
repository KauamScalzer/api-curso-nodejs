export interface UserAuthenticationModel {
  email: string
  password: string
}

export interface IUserAuthenticationUsecase {
  auth (data: UserAuthenticationModel): Promise<string | null>
}
