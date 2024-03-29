import userResolvers from "./users";
import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import merge from "lodash.merge";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers
);

export default resolvers;
