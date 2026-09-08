import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    role: string;
    image?: string | null;
    provider?: string;
  }
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      image?: string | null;
      provider?: string;
    };
    expires: string;
    id: string;
    routeToken?: string;
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    routeToken: string;
    id: string;
    role: string;
    provider?: string;
  }
}