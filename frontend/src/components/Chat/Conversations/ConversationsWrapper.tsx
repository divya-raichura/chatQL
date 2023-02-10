import { useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import Query from "../../../graphql/operations/conversation";

interface IConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FunctionComponent<
  IConversationsWrapperProps
> = ({ session }) => {
  // const {
  //   data: conversationsData,
  //   loading: conversationsLoading,
  //   error: conversationsError,
  // } = useQuery<>(Query.Queries.GET_CONVERSATIONS);

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
