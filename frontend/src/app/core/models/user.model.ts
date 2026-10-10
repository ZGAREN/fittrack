export interface UserSummary {
  id: number;
  displayName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  displayName: string;
  email: string;
}
