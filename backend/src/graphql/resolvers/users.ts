import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";

const userResolvers = {
  Query: {
    searchUsers: () => {},

    getUsers: (parent: any, args: any, context: GraphQLContext) => {
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError("You must be logged in to view users");
      }

      return prisma.user.findMany();
    },
  },

  Mutation: {
    createUsername: async (
      parent: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          success: false,
          error: "You must be logged in to create a username",
        };
      }

      try {
        const { id: userId } = session.user;

        // check that username is not already taken
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (user) {
          return {
            success: false,
            error: "That username is already taken",
          };
        }

        // update user with username
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error: any) {
        console.log("create username error");

        return {
          success: false,
          error: error?.message,
        };
      }
    },
  },
};

export default userResolvers;
