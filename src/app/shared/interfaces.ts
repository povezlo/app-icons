export interface User {
  email: string
  password: string
  returnSecureToken?: boolean
}

export interface FbAuthResponse {
  idToken: string
  expiresIn: string
}

export interface Icon {
  id?: string
  code: number
  title: string
  height?: number
  width?: number
  img: any
  price: number
  paints?: string
  pairs?: boolean
  available?: boolean
  categories?: string
  questions?: any
  comments?: any
}
