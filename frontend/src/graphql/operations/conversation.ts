import { gql } from "@apollo/client";

const ConversationFields = ` 
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
`;

export default {
  Queries: {
    GET_CONVERSATIONS: gql`
      query GetConversations {
        getConversations {
          ${ConversationFields}
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

  Subscriptions: {
    CONVERSATION_CREATED: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
  },
};
