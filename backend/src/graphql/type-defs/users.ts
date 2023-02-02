import gql from "graphql-tag";

const userTypeDefs = gql`
  type User {
    id: String!
    username: String!
  }

  type Query {
    searchUsers(username: String!): [User]!
    # getUsers(): [User]!
    getUsers: String!
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
