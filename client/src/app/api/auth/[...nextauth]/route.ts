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

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            { email, password },
            {
              timeout: 10000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Response from backend:", response.data);

          const { user, success } = response.data;
          console.log("User authenticated:", user);

          // Ensure authentication succeeded
          if (!success || !user) {
            throw new Error(response.data.message || "Login failed");
          }

          // Return the user object for the JWT token
          console.log("Returning user object:", {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
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
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none", // Required for cross-origin
        secure: true, // Required for sameSite="none"
        path: "/",
        // DO NOT set domain on vercel.app
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
      options: {
        sameSite: "none",
        secure: true,
        path: "/",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      },
    },
  },

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
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        };
      }
      console.log("Session callback - Final session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug:
    process.env.NODE_ENV === "development" ||
    process.env.NEXTAUTH_DEBUG === "true",
});

export { handler as GET, handler as POST };
