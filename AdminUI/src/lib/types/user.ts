// User types
export interface User {
  id: string
  email: string
  email_verified: boolean
  metadata: Record<string, any>
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  username: string
  last_login?: string
  created_at: string
  updated_at: string
}

// Auth types
export interface LoginCredentials {
  username?: string
  email?: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  metadata?: Record<string, any>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user?: User
  admin?: Admin
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
