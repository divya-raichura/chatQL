import { getMessagesData, getMessagesVariables } from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box } from "@mui/system";
import { toast } from "react-hot-toast";
import GQL from "../../../../graphql/operations/message";

export interface IMessageProps {
  conversationId: string;
}

export default function Message({ conversationId }: IMessageProps) {
  // const { loading, data, error } = useQuery<
  //   getMessagesData,
  //   getMessagesVariables
  // >(GQL.Queries.GET_MESSAGES, {
  //   variables: {
  //     conversationId,
  //   },
  //   onError: ({ message }) => {
  //     toast.error(message);
  //   },
  // });
  return (
    <>
      {true && (
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
    </>
  );
}
