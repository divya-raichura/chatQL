import userResolvers from "./users";
import merge from "lodash.merge";

const resolvers = merge({}, userResolvers);

export default resolvers;
