import { useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import Query from "../../../graphql/operations/conversation";
import { getConversationsData, Conversation } from "../../../util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
    subscribeToMore: conversationsSubscribeToMore,
  } = useQuery<getConversationsData, null>(Query.Queries.GET_CONVERSATIONS);

  const router = useRouter();

  const { conversationId } = router.query;

  const onClickConversation = async (conversationId: string) => {
    /**
     * push to the conversation page
     */

    router.push({ query: { conversationId } });

    /**
     * mark as read
     *  */
  };

  const subscribeToNewConversations = () => {
    conversationsSubscribeToMore({
      document: Query.Subscriptions.CONVERSATION_CREATED,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: { subscriptionData: { data: { conversationCreated: Conversation } } }
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          getConversations: [newConversation, ...prev.getConversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

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
      sx={{
        display: {
          xs: conversationId ? "none" : "flex",
          sm: "flex",
          md: "flex",
          lg: "flex",
        },
        width: {
          xs: "98%",
          sm: "48%",
          md: "35%",
        },
      }}
      height="100vh"
      bgcolor="rgb(36, 36, 36)"
      py={1}
      px={1}
    >
      {/* Skeleton Loader */}
      <ConversationsList
        session={session}
        getConversations={conversationsData?.getConversations || []}
        onClickConversation={onClickConversation}
      />
    </Box>
  );
};

export default ConversationsWrapper;
