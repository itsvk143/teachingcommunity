import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../model/User";
import dbConnect from "./db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    /* ================= GITHUB ================= */
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    /* ================= GOOGLE ================= */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    /* ================= CREDENTIALS ================= */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = bcrypt.compareSync(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid email or password");

        // ✅ IMPORTANT: RETURN ROLE
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // ⭐ REQUIRED
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /* ================= JWT ================= */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Fix for OAuth: Fetch role from DB if missing
      if (!token.role && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }

      return token;
    },

    /* ================= SESSION ================= */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // ⭐ EXPOSE ROLE TO CLIENT
      }
      return session;
    },
  },

  secret: process.env.JWT_SECRET,
};
