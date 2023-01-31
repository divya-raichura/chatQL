const userResolvers = {
  Query: {
    searchUsers: () => {},
  },

  Mutation: {
    createUsername: () => {
      console.log("createUsername");
      return { success: true };
    },
  },
};

export default userResolvers;
