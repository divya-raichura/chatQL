import { GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";
import { Prisma  } from "@prisma/client";

const resolvers = {
  // Query: {
  //   getConversations: async (
  //     _: any,
  //     __: any,
  //     context: GraphQLContext
  //   ): Promise<Array<Prisma.ConversationGetPayload<any>>> => {
  //     const { session, prisma } = context;

  //     if (!session) {
  //       throw new GraphQLError("Not authenticated");
  //     }

  //     const userId = session.user.id;

  //     try {
  //       const conversations = await prisma.conversation.findMany({
  //         where: {
  //           Participants: {
  //             some: {
  //               userId,
  //             },
  //           },
  //         },
  //         include: conversationPopulated,
  //       });

  //       return conversations;
  //     } catch (error) {
  //       console.log("getConversations error", error);
  //       throw new GraphQLError("Error getting conversations");
  //     }
  //   },
  // },

  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      // create a new conversation
      const { session, prisma } = context;

      if (!session) {
        throw new GraphQLError("Not authenticated");
      }

      const { participantIds } = args;

      const userId = session.user.id;

      if (!participantIds.includes(userId)) {
        throw new GraphQLError("You must include yourself in the conversation");
      }

      try {
        const conversation = await prisma.conversation.create({
          data: {
            Participants: {
              createMany: {
                // create a new conversation realation for each participant
                data: participantIds.map((participantId) => ({
                  userId: participantId,
                  hasUnread: participantId !== userId,
                })),
              },
            },
          },

          include: conversationPopulated,
        });

        /**
         * we write "include" so as to emit an event to the client later using pubsub
         * */

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.log("conversation create error", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
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
