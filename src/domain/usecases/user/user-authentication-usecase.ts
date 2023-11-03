export interface UserAuthentication {
  auth (email: string, password: string): Promise<string | null>
}
