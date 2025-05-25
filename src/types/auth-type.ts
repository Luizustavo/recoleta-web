export interface AuthProps {
  children: React.ReactNode;
}

export interface AccessType {
  email: string;
  password: string;
}

export interface AuthCoxtextData {
  signIn: (user: AccessType) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export type AccessResultType = {
  accessToken: string;
};
