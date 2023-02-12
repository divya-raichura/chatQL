import gql from "graphql-tag";

const conversationTypeDefs = gql`
  scalar Date

  type Query {
    getConversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
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
    Participants: [Participant]
    latestMessage: Message
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasUnread: Boolean
  }
`;

export default conversationTypeDefs;
