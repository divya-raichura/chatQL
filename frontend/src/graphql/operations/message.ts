import { gql } from "@apollo/client";

export const MessageFields = `
    id
    sender {
        id
        username
    }
    text
    createdAt
`;

export default {
  Queries: {
    GET_MESSAGES: gql`
      query GetMessages($conversationId: String!) {
        getMessages(conversationId: $conversationId) {
            ${MessageFields}
        }
      }
    `,
  },

  Mutations: {
    SEND_MESSAGE: gql`
      mutation SendMessage(
        $conversationId: String!
        $text: String!
        $senderId: String!
      ) {
        sendMessage(
          conversationId: $conversationId
          text: $text
          senderId: $senderId
        )
      }
    `,
  },

  Subscriptions: {
    MESSAGE_SENT: gql`
        subscription MessageSent($conversationId: String!) {
            messageSent(conversationId: $conversationId) {
                ${MessageFields}
            }
        }
    `,
  },
};
