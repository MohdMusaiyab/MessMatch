import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          // API call to your backend to authenticate the user
          const response = await axios.post(
            `${process.env.BACKEND_URL}/api/auth/login`,
            { email, password }
          );

          const user = response.data;

          // If no user is returned, throw an error
          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Return the user object
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error("Authentication error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom sign-in page (optional)
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // If you need the user's role in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role; // Include role in session if needed
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Define your secret in .env
});

export { handler as GET, handler as POST };
