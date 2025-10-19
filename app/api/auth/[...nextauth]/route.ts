import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // TS thinks "jwt" is just a string; make it a literal:
  session: { strategy: "jwt" as const },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
