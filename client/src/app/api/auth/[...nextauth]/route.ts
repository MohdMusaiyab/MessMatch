import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check for missing credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { email, password } = credentials;

          // Authenticate with your backend
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            { email, password }
          );

          const { user, success } = response.data;

          // Ensure authentication succeeded
          if (!success || !user) {
            throw new Error(response.data.message || "Login failed");
          }

          // Return the user object for the JWT token
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.error(
              "Authentication error:",
              error.response.data || error.message
            );
            throw new Error(error.response.data?.message || "Login failed");
          } else {
            console.error("Authentication error:", error);
            throw new Error("Login failed");
          }
        }
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' 
          ? '.onrender.com' 
          : undefined
      }
    }
  },
  pages: {
    signIn: "/auth/login", // Optional: Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    // Add user information to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    // Pass the token to the session
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
});

export { handler as GET, handler as POST };
