/**
 * User related types
 */
export interface createUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface createUsernameVariables {
  username: String;
}

export interface searchUserVariables {
  username: String;
}

export interface searchUserData {
  getUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: String;
}

/**
 * Conversation related types
 */

export interface getConversationsData {
  getConversations: Array<Conversation>;
}

export interface Conversation {
  id: string;
  Participants: Array<Participant>;
  latestMessage: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  user: User;
  hasUnread: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string;
}

export interface Message {
  id: string;
  sender: User;
  text: string;
  createdAt: string;
}

export interface createConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface createConversationVariables {
  participantIds: Array<string>;
}
