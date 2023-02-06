import { gql } from "@apollo/client";

export default {
  Mutations: {
    CREATE_CONVERSATION: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },

  Subscriptions: {},
};
