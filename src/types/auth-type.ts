export interface AuthProps {
  children: React.ReactNode;
}

export interface AccessType {
  email: string;
  password: string;
}

export interface RegisterType {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextData {
  signIn: (user: AccessType) => Promise<boolean>;
  signUp: (user: RegisterType) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

export type AccessResultType = {
  success: boolean;
  message: string;
  code: string;
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
};
