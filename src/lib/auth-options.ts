import { Account, Profile, Session, User } from "next-auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { CredentialInput } from "next-auth/providers/credentials";

// Extend Session type to include accessToken and backendToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
  }
}

interface ExtendedAccount extends Account {
  backendToken?: string;
}

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  API_URL, // your backend base URL
} = process.env;

export const authOptions: AuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID!,
      clientSecret: FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn(params: {
      user: User;
      account: Account | null;
      profile?: Profile | undefined;
      email?: { verificationRequest?: boolean } | undefined;
      credentials?: Record<string, CredentialInput> | undefined;
    }) {
      const { account, profile } = params;
      if (!account?.provider || !account?.access_token) {
        console.error("❌ Missing provider or access_token in account object");
        return false;
      }

      // Dynamically select backend endpoint based on provider
      const providerRoute =
        account.provider === "google"
          ? "google"
          : account.provider === "facebook"
          ? "facebook"
          : null;

      if (!providerRoute) {
        console.warn(`⚠️ Unsupported provider: ${account.provider}`);
        return false;
      }

      const backendUrl = `${API_URL}/api/auth/${providerRoute}`;

      // Send the OAuth token to your backend to log in or register the user
      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: account?.provider,
            token: account?.access_token,
            profile,
          }),
        });

        if (!response.ok) throw new Error("Backend login failed");
        const data = await response.json();
        console.log(`✅ ${providerRoute} login synced with backend:`, data);

        // Store backend JWT token in the account object so it can be accessed in jwt callback
        if (data.access_token) {
          account.backendToken = data.access_token;
        }

        return true;
      } catch (err) {
        console.error("❌ Error syncing social login with backend:", err);
        return false;
      }
    },
    async jwt({
      token,
      account,
    }: {
      token: import("next-auth/jwt").JWT;
      account: Account | null;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        // Store the backend JWT token
        const extendedAccount = account as ExtendedAccount;
        token.backendToken = extendedAccount.backendToken;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: import("next-auth/jwt").JWT;
    }) {
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      // Add backend token to session
      session.backendToken =
        typeof token.backendToken === "string" ? token.backendToken : undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
