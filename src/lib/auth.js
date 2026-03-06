import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../model/User";
import dbConnect from "./dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
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

  callbacks: {
    /* ================= SIGN IN (Auto-Register) ================= */
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          console.log("SignIn Callback Started:", user.email);
          await dbConnect();
          const email = user.email.toLowerCase();
          const existingUser = await User.findOne({ email });
          console.log("User Exists:", !!existingUser);

          if (!existingUser) {
            console.log("Creating new user...");
            await User.create({
              name: user.name,
              email: email,
              role: 'user',
            });
            console.log("New user created successfully");
          }
          return true;
        } catch (error) {
          console.error("Error in SignIn Callback:", error);
          // ⚠️ FAIL OPEN: Return true to allow login even if DB check fails
          return true;
        }
      }
      return true;
    },

    /* ================= JWT ================= */
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id || user._id;
      }

      // Fix for OAuth: Fetch role from DB if missing
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
          // Fallback: do not fail session
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
