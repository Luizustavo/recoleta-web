import NextAuth, { Account, Profile, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { CredentialInput } from "next-auth/providers/credentials";

// Extend Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  NEXT_PUBLIC_API_URL, // your backend base URL
} = process.env;

export const authOptions = {
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

      const backendUrl = `${NEXT_PUBLIC_API_URL}/api/auth/${providerRoute}`;

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

        // Optionally store backend JWT in cookie here
        // e.g., cookies().set("recoleta_access_token", data.token);

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
      if (account) token.accessToken = account.access_token;
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
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
