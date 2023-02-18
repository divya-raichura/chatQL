import { gql } from "graphql-tag";

const typeDefs = gql`
  # messages
  type Message {
    id: String
    sender: User
    text: String
    createdAt: Date
  }

  # get messages query
  type Query {
    getMessages(conversationId: String!): [Message]
  }

  # send message mutation
  type Mutation {
    sendMessage(
      text: String!
      conversationId: String!
      senderId: String!
    ): Boolean
  }

  # send message subscription
  type Subscription {
    messageSent(conversationId: String!): Message
  }
`;

export default typeDefs;
