export interface UserAuthenticationModel {
  email: string
  password: string
}

export interface IUserAuthentication {
  auth (data: UserAuthenticationModel): Promise<string | null>
}
