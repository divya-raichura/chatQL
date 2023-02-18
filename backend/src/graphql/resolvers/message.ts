import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import {
  GraphQLContext,
  MessagePopulated,
  SendMessageArgs,
} from "../../util/types";
import { conversationPopulated } from "./conversation";
import { MessageSubscriptionPayload } from "../../util/types";

const resolvers = {
  Query: {
    getMessages: async (
      parent: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<MessagePopulated>> => {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authenticated");
      }

      const userId = session.user.id;

      const { conversationId } = args;

      /**
       * Verify that conversation exists & user is a participant
       */
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw new GraphQLError("Conversation not found");
      }

      const isParticipant = conversation.Participants.some(
        (participant) => participant.userId === userId
      );

      if (!isParticipant) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: "desc",
          },
        });

        return messages;
      } catch (error) {
        console.log("getMessages error", error);
        throw new GraphQLError("Error getting messages");
      }
    },
  },

  Mutation: {
    sendMessage: async (
      parent: any,
      args: SendMessageArgs,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;
      const { conversationId, senderId, text } = args;

      if (!session) {
        throw new GraphQLError("Not authenticated");
      }

      const userId = session.user.id;

      // check if the user is the sender of the message
      if (userId !== senderId) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // Create a new message
        const newMessage = await prisma.message.create({
          data: {
            text,
            senderId,
            conversationId,
          },

          include: messagePopulated,
        });

        const participant = await prisma.userConversation.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError("Not authorized");
        }

        // Update the last message of the conversation
        const updatedConversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            Participants: {
              update: {
                where: {
                  id: participant.id,
                },
                data: {
                  hasSeen: true,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        // Publish the new message
        pubsub.publish("MESSAGE_SENT", {
          messageSent: newMessage,
        });

        // Publish the updated conversation
        // pubsub.publish("conversationUpdated", {
        // conversationUpdated: updatedConversation,
        // });
      } catch (error) {
        console.log("sendMessage error", error);
        throw new GraphQLError("Error sending message");
      }

      return true;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (parent: any, args: any, context: GraphQLContext) => {
          return context.pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: MessageSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },

  //   Subscription: {
  //     messageCreated: {
  //       subscribe: () => pubsub.asyncIterator("messageCreated"),
  //     },
  //   },
};

/**
 * Prisma Validators
 */

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
