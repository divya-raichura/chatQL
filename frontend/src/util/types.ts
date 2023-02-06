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

export interface createConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface createConversationVariables {
  participantIds: Array<string>;
}
