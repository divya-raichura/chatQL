import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";
import { User } from "@prisma/client";

const userResolvers = {
  Query: {
    getUsers: async (
      parent: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { prisma, session } = context;
      const { username: searchedUsername } = args;

      if (!session?.user) {
        throw new GraphQLError("You must be logged in to view users");
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        // console.log("searchedUsername", searchedUsername);
        // console.log("myUsername", myUsername);
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("get users error");

        throw new GraphQLError(error?.message);
      }
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
