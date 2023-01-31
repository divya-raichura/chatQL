const userResolvers = {
  Query: {
    searchUsers: () => {},
  },

  Mutation: {
    createUsername: (parent: any, args: { username: string }, context: any) => {
      const { username } = args;
      console.log("here is context", context);
    },
  },
};

export default userResolvers;
