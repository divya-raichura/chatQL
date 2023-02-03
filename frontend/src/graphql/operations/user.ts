import { gql } from "@apollo/client";

export default {
  Queries: {
    GET_USERS: gql`
      query GetUsers($username: String!) {
        getUsers(username: $username) {
          id
          username
        }
      }
    `,
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
