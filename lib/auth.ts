import { NextAuthOptions } from "next-auth";

// Basic auth options - this would need to be expanded based on your actual auth implementation
export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: '/login',
  },
};
