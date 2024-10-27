export interface IAuthenticateUseCases {
  signIn: (email: string, password: string) => Promise<{ id: string } | null>;

  createAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
}
