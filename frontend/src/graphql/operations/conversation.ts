import { gql } from "@apollo/client";

export default {
  Queries: {
    GET_CONVERSATIONS: gql`
      query GetConversations {
        getConversations {
          id
          Participants {
            id
            user {
              id
              username
            }
            hasUnread
          }
          latestMessage {
            id
            sender {
              id
              username
            }
            text
            createdAt
          }
          updatedAt
        }
      }
    `,
  },

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
