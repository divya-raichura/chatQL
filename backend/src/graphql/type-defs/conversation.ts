import gql from "graphql-tag";

const conversationTypeDefs = gql`
  scalar Date

  type Query {
    getConversations: [Conversation]
  }

  type Mutation {
    createConversation(
      participantIds: [String]!
      conversationName: String
    ): createConversationResponse
    markConversationAsSeen(conversationId: String!, userId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
    # conversationUpdated: Conversation
  }

  type createConversationResponse {
    conversationId: String
  }

  type Conversation {
    id: String
    conversationName: String!
    Participants: [Participant]
    latestMessage: Message
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeen: Boolean
  }
`;

export default conversationTypeDefs;
