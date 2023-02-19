import {
  getMessagesData,
  getMessageStructure,
  getMessagesVariables,
} from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { toast } from "react-hot-toast";
import GQL from "../../../../graphql/operations/message";
import CircularProgress from "@mui/material/CircularProgress";
import { Stack } from "@mui/material";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

export interface IMessageProps {
  userId: string;
  conversationId: string;
}

export default function Message({ conversationId, userId }: IMessageProps) {
  const dummy = useRef<HTMLDivElement>(null);

  const { loading, data, error, subscribeToMore } = useQuery<
    getMessagesData,
    getMessagesVariables
  >(GQL.Queries.GET_MESSAGES, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const subscribeToNewMessages = (conversationId: string) => {
    subscribeToMore({
      document: GQL.Subscriptions.MESSAGE_SENT,
      variables: {
        conversationId,
      },
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: { subscriptionData: { data: { messageSent: getMessageStructure } } }
      ) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          getMessages:
            newMessage.sender.id === userId
              ? prev.getMessages
              : [...prev.getMessages, newMessage],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = () => subscribeToNewMessages(conversationId);

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  if (error) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end",
        overflow: "hidden",
        width: "100%",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
          m: 1,
        }}
      >
        {loading ? (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {data?.getMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                sentByMe={userId === message.sender.id}
              />
            ))}
            <div ref={dummy}></div>
          </>
        )}
      </Box>
    </Box>
  );
}

// <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "flex-end",
//             overflow: "hidden",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               overflowY: "scroll",
//               height: "100%",
//             }}
//           >
//             {data?.getMessages.map((message) => (
//               // <MessageItem />
//               <Typography>{message.text}</Typography>
//             ))}
//           </Box>
//         </Box>

// <>
//       {loading && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       )}

//       {!loading && data?.getMessages.length == 0 && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           <h1>Send a message!</h1>
//         </Box>
//       )}

//       {!loading && data && data?.getMessages.length > 0 && (
//         <Stack
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             overflowY: "scroll",
//             height: "100%",
//           }}
//         >
//           {data?.getMessages.map((message) => (
//             <MessageItem
//               message={message}
//               sentByMe={userId === message.sender.id}
//             />
//           ))}
//         </Stack>
//       )}
//     </>
