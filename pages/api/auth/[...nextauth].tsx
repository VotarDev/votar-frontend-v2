import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     return baseUrl;
  //   },
  // },

  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
