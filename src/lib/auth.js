import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../model/User";
import dbConnect from "./dbConnect";
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
      allowDangerousEmailAccountLinking: true,
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

  debug: true, // 🔹 Enable Debug Logs

  /* ================= DEBUG MODE: DB DISABLED ================= */
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn (DB DISABLED):", user.email);
      return true; // Always allow
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user'; // Default role
        token.id = user._id || 'temp_id';
      }
      // DB Logic commented out for testing
      /*
      if (!token.role && token.email) {
         try {
           await dbConnect();
           const dbUser = await User.findOne({ email: token.email });
           if (dbUser) {
             token.role = dbUser.role;
             token.id = dbUser._id.toString();
           }
         } catch (error) {
           console.error("Error in JWT callback (DB fetch):", error);
         }
      }
      */
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
