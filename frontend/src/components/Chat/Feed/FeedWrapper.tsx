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
      height="100vh"
      border="10px solid green"
      width="100%"
      bgcolor="rgba(255, 255, 255, 0.06)"
    >
      {conversationId ? (
        <Box>{conversationId}</Box>
      ) : (
        <Box>No conversation selected</Box>
      )}
    </Box>
  );
};

export default FeedWrapper;
