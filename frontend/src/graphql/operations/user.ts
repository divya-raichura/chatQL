import { gql } from "@apollo/client";

export default {
  Queries: {
    // GET_USERS: gql`
    //   query GetUsers {
    //     getUser {
    //       id
    //       username
    //       email
    //       createdAt
    //       updatedAt
    //     }
    //   }
    // `,
  },

  Mutations: {
    CREATE_USERNAME: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },

  Subscriptions: {},
};
