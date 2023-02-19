import { Box } from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";
import Input from "./Messages/Input";
import Message from "./Messages/Messages";

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<IFeedWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { id: userId } = session.user;

  const { conversationId } = router.query;

  return (
    // display flex only when there is a conversation selected otherwise none, for mobile
    // for desktop, display flex always
    <Box
      sx={{
        display: {
          xs: conversationId ? "flex" : "none",
          sm: "flex",
          md: "flex",
          lg: "flex",
        },
        width: {
          xs: "98%",
          sm: "48%",
          md: "64%",
        },
        height: "100vh",
        bgcolor: "rgba(255, 255, 255, 0.06)",
      }}
    >
      {conversationId ? (
        <>
          <Box
            width="100%"
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            {/* messages header */}
            <MessagesHeader conversationId={conversationId as string} />
            {/* <Box flexGrow={1} /> */}

            {/* messages */}
            <Message
              userId={userId}
              conversationId={conversationId as string}
            />

            {/* input */}
            <Input userId={userId} conversationId={conversationId as string} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <h1>Start a conversation</h1>
        </Box>
      )}
    </Box>
  );
};

export default FeedWrapper;
