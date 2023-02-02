import Grid from "@mui/material/Unstable_Grid2";
import { Session } from "next-auth";
import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

interface IChatProps {
  session: Session;
}

const Chat: React.FC<IChatProps> = ({ session }) => {
  return (
    <Grid container border="2px red solid" height="100vh" width="100%">
      <Grid xs={12} sm={4} md={4}>
        <ConversationsWrapper session={session} />
      </Grid>
      <Grid xs={0} sm={8} md={8}>
        <FeedWrapper session={session} />
      </Grid>
    </Grid>
  );
};

export default Chat;
