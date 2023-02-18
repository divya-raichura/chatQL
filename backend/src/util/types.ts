import { ISODateString } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { conversationPopulated } from "../graphql/resolvers/conversation";
import { Context } from "graphql-ws/lib/server";
import { PubSub } from "graphql-subscriptions";
import { messagePopulated } from "../graphql/resolvers/message";

/**
 * Server config
 */

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}
export interface Session {
  user: User;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

/**
 * users
 */

// we added this interface, so now typescript knows about the user object
// but next-auth will still give us the user object with name, email, image only
// so we want to make the two match, so we add these custom properties to actual next-auth session
// by using callbacks
export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string;
}

export interface CreateUsernameResponse {
  success: boolean;
  error?: string;
}

/**
 * conversations
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

/**
 * messages
 */

// export interface Message {
//   id: string;
//   text: string;
//   createdAt: Date;
//   sender: User;
//   conversation: ConversationPopulated;
// }

export interface SendMessageArgs {
  text: string;
  conversationId: string;
  senderId: string;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;

export interface MessageSubscriptionPayload {
  messageSent: MessagePopulated;
}
