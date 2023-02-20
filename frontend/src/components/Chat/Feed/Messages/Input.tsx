import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { FiSend } from "react-icons/fi";
import { Box, TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import GQL from "../../../../graphql/operations/message";
import { useMutation } from "@apollo/client";
import {
  getMessagesData,
  sendMessageData,
  sendMessageVariables,
} from "@/util/types";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useSession } from "next-auth/react";

interface IInputProps {
  userId: string;
  conversationId: string;
}

const Input: React.FunctionComponent<IInputProps> = ({
  userId,
  conversationId,
}) => {
  const [message, setMessage] = React.useState("");
  const [sendMessageMutation, { loading }] = useMutation<
    sendMessageData,
    sendMessageVariables
  >(GQL.Mutations.SEND_MESSAGE);

  const { data: session } = useSession();

  const submitHandler = async (e: any) => {
    // if (e.keyCode != 13) {
    // return;
    // }
    e.preventDefault();

    try {
      // TODO: send message
      if (!message || !conversationId) return;
      if (message.length > 500) {
        toast.error("Message must be less than 500 characters");
        return;
      }

      const sendMessageArgs = {
        variables: {
          conversationId,
          text: message,
          senderId: userId,
        },
      };

      setMessage("");

      // without optimistic response, the message will not be sent until the server responds
      // with the message. With optimistic response, the message will be sent immediately
      // and the server will respond with the message. This will update the cache and
      // the message will be displayed in the UI.
      const { data, errors } = await sendMessageMutation({
        ...sendMessageArgs,
        optimisticResponse: {
          sendMessage: true, // the server will respond with the message, this is just a placeholder for now
          // that is, we write here what server will respond with
        },

        // update the cache with the new message
        update: (cache, { data }) => {
          const cacheData = cache.readQuery<getMessagesData>({
            query: GQL.Queries.GET_MESSAGES,
            variables: {
              conversationId,
            },
          });

          if (cacheData) {
            cache.writeQuery({
              query: GQL.Queries.GET_MESSAGES,
              variables: {
                conversationId,
              },
              data: {
                getMessages: [
                  ...cacheData.getMessages,
                  {
                    id: Math.random().toString(),
                    text: message,
                    senderId: userId,
                    conversationId,
                    createdAt: new Date().toISOString(),
                    __typename: "Message",
                    sender: {
                      id: userId,
                      username: session?.user.username,
                      __typename: "User",
                    },
                  },
                ],
              },
            });
          }
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }

      console.log("message sent", data.sendMessage);
    } catch (error: any) {
      console.log("send message error", error);
      toast.error(error?.message);
    }
  };

  // input box that sends message on enter and shift enter means new line

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0.5rem",
        margin: "0.5rem 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "0.5rem",
          borderRadius: "0.5rem",
        }}
        mx={5}
      >
        <Paper
          sx={{
            backgroundColor: "#1e1e1e",
            // border color to match the elevation
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextareaAutosize
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              // border: "1px solid #ccc",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "1rem",
              fontFamily: "inherit",
              color: "inherit",
              backgroundColor: "transparent",
            }}
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitHandler(e);
              }
            }}
          />
        </Paper>
        <IconButton
          sx={{ padding: "0.5rem" }}
          onClick={submitHandler}
          disabled={loading}
        >
          <FiSend />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Input;
