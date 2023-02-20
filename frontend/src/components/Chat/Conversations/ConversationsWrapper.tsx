import { gql, useMutation, useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import GQL from "../../../graphql/operations/conversation";
import {
  getConversationsData,
  Conversation,
  Participant,
} from "../../../util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

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
  } = useQuery<getConversationsData, null>(GQL.Queries.GET_CONVERSATIONS);

  const [markAsRead] = useMutation<
    { markConversationAsSeen: boolean },
    { conversationId: string; userId: string }
  >(GQL.Mutations.MARK_CONVERSATION_AS_SEEN);

  const router = useRouter();

  const { conversationId } = router.query;

  const onClickConversation = async (
    conversationId: string,
    hasSeenMessage: boolean
  ) => {
    /**
     * push to the conversation page
     */

    router.push({ query: { conversationId } });

    /**
     * mark as read
     *  */
    if (hasSeenMessage) return;

    // mark as read mutation
    try {
      await markAsRead({
        variables: {
          conversationId,
          userId: session.user.id,
        },
        optimisticResponse: {
          markConversationAsSeen: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            Participants: Array<Participant>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                Participants {
                  user {
                    id
                    username
                  }
                  hasSeen
                }
              }
            `,
          });

          if (!participantsFragment) return;

          // console.log("participantsFragment", participantsFragment);

          const participants = [...participantsFragment.Participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === session.user.id
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeen: true,
          };

          // console.log("participants", participants);

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                Participants
              }
            `,
            data: {
              Participants: participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("mark as read error", error);
    }
  };

  const subscribeToNewConversations = () => {
    return conversationsSubscribeToMore({
      document: GQL.Subscriptions.CONVERSATION_CREATED,
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
    const unsubscribe = subscribeToNewConversations();

    return () => unsubscribe();
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

  if (conversationsError) {
    toast.error("There was an error fetching conversations");
    return null;
  }

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
        conversationLoading={conversationsLoading}
      />
    </Box>
  );
};

export default ConversationsWrapper;
