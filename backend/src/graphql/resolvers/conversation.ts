import {
  ConversationPopulated,
  GraphQLContext,
  ConversationCreatedSubscriptionPayload,
} from "../../util/types";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {
    getConversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;
      if (!session) {
        throw new GraphQLError("Not authenticated");
      }
      const userId = session.user.id;
      try {
        const conversations = await prisma.conversation.findMany({
          where: {
            Participants: {
              some: {
                userId,
              },
            },
          },
          include: conversationPopulated,
        });
        return conversations;
      } catch (error: any) {
        console.log("getConversations error", error);
        throw new GraphQLError("Error getting conversations");
      }
    },
  },

  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string>; conversationName: string },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      // create a new conversation
      const { session, prisma, pubsub } = context;

      if (!session) {
        throw new GraphQLError("Not authenticated");
      }

      const { participantIds, conversationName } = args;

      const userId = session.user.id;

      if (!participantIds.includes(userId)) {
        throw new GraphQLError("You must include yourself in the conversation");
      }

      if (participantIds.length === 1) {
        throw new GraphQLError(
          "You must include at least one other person in the conversation"
        );
      }

      let convoName: string;

      if (conversationName) {
        convoName = conversationName;
      } else {
        try {
          const participants = await prisma.user.findMany({
            where: {
              id: {
                in: participantIds,
              },
            },
            select: {
              username: true,
            },
          });

          convoName = participants
            .map((p) => p.username)
            .sort()
            .join(", ");
        } catch (error: any) {
          console.log("createConversation error", error);
          throw new GraphQLError("Error creating conversation");
        }
      }

      try {
        const conversation = await prisma.conversation.create({
          data: {
            Participants: {
              createMany: {
                // create a new conversation realation for each participant
                data: participantIds.map((participantId) => ({
                  userId: participantId,
                  hasSeen: participantId === userId,
                })),
              },
            },
            conversationName: convoName,
          },

          include: conversationPopulated,
        });

        /**
         * we write "include" so as to emit an event to the client later using pubsub
         * we will use pubsub instance to emit conversation created event which the new subscription
         * that we created in typedef will subscribe/listen to
         * */

        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.log("conversation create error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
  },

  Subscription: {
    conversationCreated: {
      // subscribe: (_: any, __: any, context: GraphQLContext) => {
      //   const { pubsub } = context;
      //   return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      // },
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          variables,
          context: GraphQLContext
        ) => {
          const { session } = context;
          const { Participants } = payload.conversationCreated;

          const userIsParticipant = !!Participants.find(
            (p) => p.userId === session?.user.id
          );

          return userIsParticipant;
        }
      ),
    },
    // conversationUpdated: {
    //   subscribe: (_: any, __: any, context: GraphQLContext) => {
    //     const { pubsub } = context;
    //     return pubsub.asyncIterator("conversationUpdated");
    //   },
    // },
  },
};

/**
 * prisma validator
 *  */

export const ParticipantPopulated =
  Prisma.validator<Prisma.UserConversationInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    Participants: {
      include: ParticipantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
