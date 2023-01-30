import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import * as React from "react";

interface IChatProps {}

const Chat: React.FunctionComponent<IChatProps> = (props) => {
  return (
    <div>
      CHAT
      <Button color="primary" variant="contained" onClick={() => signOut()}>
        sign out
      </Button>
    </div>
  );
};

export default Chat;
