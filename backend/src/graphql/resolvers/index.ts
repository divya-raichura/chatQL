import userResolvers from "./users.js";
import conversationResolvers from "./conversation.js";
import messageResolvers from "./message.js";
import merge from "lodash.merge";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers
);

export default resolvers;
