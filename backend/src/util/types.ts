import { ISODateString } from "next-auth";
import { PrismaClient } from "@prisma/client";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

/**
 * users
 */
export interface Session {
  user: User;
  expires: ISODateString;
}

// we added this interface, so now typescript knows about the user object
// but next-auth will still give us the user object with name, email, image only
// so we want to make the two match, so we add these custom properties to actual next-auth session
// by using callbacks
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  image: string;
}

export interface CreateUsernameResponse {
  success: boolean;
  error?: string;
}
