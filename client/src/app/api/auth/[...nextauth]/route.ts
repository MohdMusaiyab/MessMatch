import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { SignJWT } from "jose";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isDemo: { label: "isDemo", type: "text" },
        demoRole: { label: "demoRole", type: "text" },
      },
      async authorize(credentials) {
        let email = credentials?.email;
        let password = credentials?.password;

        if (credentials?.isDemo === "true") {
          if (credentials.demoRole === "contractor") {
            email = process.env.DEMO_CONTRACTOR_EMAIL;
            password = process.env.DEMO_CONTRACTOR_PASSWORD;
          } else if (credentials.demoRole === "institution") {
            email = process.env.DEMO_INSTITUTION_EMAIL;
            password = process.env.DEMO_INSTITUTION_PASSWORD;
          }
        }

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/v1";
          const response = await axios.post(
            `${backendUrl}/auth/login`,
            { email, password },
            {
              timeout: 30000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { user, success } = response.data;

          if (!success || !user) {
            throw new Error(response.data?.message || "Login failed");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || "Login failed");
          }
          throw new Error("Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      if (token.id && process.env.NEXTAUTH_SECRET) {
        const secretBytes = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        token.accessToken = await new SignJWT({
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(secretBytes);
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
