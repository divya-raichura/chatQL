import { GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";

const resolvers = {
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ) => {
      // create a new conversation
      console.log("createConversation resolver", args);
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

          include: {
            Participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
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
          },
        });
      } catch (error) {}
    },
  },
};

export default resolvers;
