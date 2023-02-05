import gql from "graphql-tag";

const userTypeDefs = gql`
  type SearchedUser { # even though in resolvers, we return a User, the full entity,
    # we need to return a SearchedUser, only these two fields as frontend is asking for them
    # so only these two values will be returned trhough the network
    id: String!
    username: String!
  }

  type Query {
    searchUsers(username: String!): [SearchedUser]!
    getUsers(username: String!): [SearchedUser]!
  }

  type Mutation {
    createUsername(username: String!): createUsernameResponse!
  }

  type createUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default userTypeDefs;
