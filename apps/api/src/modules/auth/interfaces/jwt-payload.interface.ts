export interface JwtPayload {
  sub: string;           // User ID
  email: string;
  organizationId: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
  };
  tokens: AuthTokens;
}
