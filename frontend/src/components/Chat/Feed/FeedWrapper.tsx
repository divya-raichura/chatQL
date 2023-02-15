import { Box } from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<IFeedWrapperProps> = ({
  session,
}) => {
  const router = useRouter();

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
        border: "10px solid green",
        // width: "100%",
        bgcolor: "rgba(255, 255, 255, 0.06)",
      }}
    >
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexGrow: 1,
          border: "2px solid red",
        }}
      >
        conversation id: {conversationId}
      </Box>
    </Box>
  );
};

export default FeedWrapper;
