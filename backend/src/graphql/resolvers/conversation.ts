import { GraphQLContext } from "../../util/types";

const resolvers = {
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ) => {
      // create a new conversation
      console.log("createConversation resolver", args);
    },
  },
};

export default resolvers;
