import gql from "graphql-tag";

const conversationTypeDefs = gql`
  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
  }

  type createConversationResponse {
    conversationId: String
  }
`;

export default conversationTypeDefs;
