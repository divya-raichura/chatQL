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
