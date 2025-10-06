export interface InsurerAuthDto {
  id: string;
  insurerName: string;
  grantType: string;
  clientId: string;
  clientSecret: string;
  username?: string;
  password?: string;
  scope?: string;
  baseUrl: string;
  authUrl?: string;
}