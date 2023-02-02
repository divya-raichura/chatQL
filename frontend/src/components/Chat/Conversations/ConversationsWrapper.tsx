import { Box } from "@mui/system";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";

interface IConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FunctionComponent<
  IConversationsWrapperProps
> = ({ session }) => {
  return (
    <Box
      width="100%"
      height="100vh"
      border="2px blue solid"
      bgcolor="rgba(255,255,255,0.1)"
      py={2}
      px={2}
    >
      {/* Skeleton Loader */}
      <ConversationsList session={session} />
    </Box>
  );
};

export default ConversationsWrapper;
