import gql from "graphql-tag";

const conversationTypeDefs = gql`
  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
  }

  type createConversationResponse {
    conversationId: String
  }

  # type Query {
  #   getConversations: [Conversation]
  # }

  # type Conversation {
  #   id: String
  #   Participants: [Participant]
  #   latestMessage: Message
  # }
`;

export default conversationTypeDefs;
