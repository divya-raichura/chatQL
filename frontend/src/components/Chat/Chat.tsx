import { Box, Divider, Grid, Stack } from "@mui/material";
import { Session } from "next-auth";
import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

interface IChatProps {
  session: Session;
}

const Chat: React.FC<IChatProps> = ({ session }) => {
  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={0.5}
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Stack>
  );
};

export default Chat;

//  <Grid container>
//    <Grid item xs={12} sm={6} md={5} lg={4}>
//      <ConversationsWrapper session={session} />
//    </Grid>
//    <Grid item xs={0} sm={6} md={7} lg={8}>
//      <FeedWrapper session={session} />
//    </Grid>
//  </Grid>;
