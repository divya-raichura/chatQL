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
              hasSeen
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
    MARK_CONVERSATION_AS_SEEN: gql`
      mutation MarkConversationAsSeen(
        $conversationId: String!
        $userId: String!
      ) {
        markConversationAsSeen(conversationId: $conversationId, userId: $userId)
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
