import { useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import Query from "../../../graphql/operations/conversation";
import { getConversationsData } from "../../../util/types";
interface IConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FunctionComponent<
  IConversationsWrapperProps
> = ({ session }) => {
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
  } = useQuery<getConversationsData, null>(Query.Queries.GET_CONVERSATIONS);

  console.log(conversationsData);

  // if (conversationsLoading) {
  //   return (
  //     <Box
  //       width="100%"
  //       height="100vh"
  //       border="2px blue solid"
  //       bgcolor="rgba(255,255,255,0.1)"
  //       py={2}
  //       px={2}
  //     >
  //       {/* Skeleton Loader */}
  //     </Box>
  //   );
  // }  

  return (
    <Box
      width="100%"
      height="100vh"
      border="2px blue solid"
      bgcolor="rgba(255,255,255,0.1)"
      py={1.5}
      px={1.5}
    >
      {/* Skeleton Loader */}
      <ConversationsList
        session={session}
        getConversations={conversationsData?.getConversations || []}
      />
    </Box>
  );
};

export default ConversationsWrapper;
