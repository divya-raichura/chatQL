import gql from "graphql-tag";

const conversationTypeDefs = gql`
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
  }

  type createConversationResponse {
    conversationId: String
  }

  type Query {
    getConversations: [Conversation]
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
