export interface UserAuthenticationModel {
  email: string
  password: string
}

export interface UserAuthentication {
  auth (data: UserAuthenticationModel): Promise<string | null>
}
