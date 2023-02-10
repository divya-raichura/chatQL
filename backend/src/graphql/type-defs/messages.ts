import { gql } from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    text: String
    createdAt: Date
  }
`;

export default typeDefs;
