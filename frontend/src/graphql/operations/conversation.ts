import { gql } from "@apollo/client";

const ConversationFields = ` 
            id
            conversationName
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
      mutation CreateConversation(
        $participantIds: [String]!
        $conversationName: String!
      ) {
        createConversation(
          participantIds: $participantIds
          conversationName: $conversationName
        ) {
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
