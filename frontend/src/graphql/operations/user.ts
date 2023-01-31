import { gql } from "@apollo/client";

export default {
  Queries: {},

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
