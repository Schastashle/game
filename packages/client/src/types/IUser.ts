export interface IUser {
  avatar: string
  display_name: string
  email: string
  first_name: string
  id: number
  login: string
  phone: string
  second_name: string
}

export interface IUserLogin {
  login: string
  password: string
}

export interface IUserSignup {
  confirm_password: string
  email: string
  first_name: string
  login: string
  password: string
  phone: string
  second_name: string
}
