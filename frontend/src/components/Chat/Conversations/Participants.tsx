import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  createConversationData,
  createConversationVariables,
  SearchedUser,
} from "@/util/types";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

interface IParticipantsProps {
  participants: Array<SearchedUser>;
  addParticipants: Dispatch<SetStateAction<SearchedUser[]>>;
  removeParticipant: (user: SearchedUser) => void;
  setSearch: Dispatch<SetStateAction<string>>;
  session: Session;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  wordWrap: "break-word",
}));

const Participants: React.FunctionComponent<IParticipantsProps> = ({
  participants,
  setSearch,
  addParticipants,
  session,
  removeParticipant,
}) => {
  const [createConversation, { loading: createConversationLoading, error }] =
    useMutation<createConversationData, createConversationVariables>(
      ConversationOperations.Mutations.CREATE_CONVERSATION
    );

  const [conversationName, setConversationName] = useState<string>("");

  const router = useRouter();

  const userId = session.user.id;

  const createConversationHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await createConversation({
        variables: {
          participantIds: [userId, ...participants.map((p) => p.id)],
          conversationName:
            participants.length == 1
              ? participants[0].username.toString()
              : conversationName,
        },
      });

      if (!data?.createConversation) {
        throw new Error("Error creating conversation");
      }

      const { conversationId } = data.createConversation;

      router.push({ query: { conversationId } });

      /**
       * clear state
       */
      addParticipants([]);
      setSearch("");
    } catch (error: any) {
      console.log("onCreateConversation error", error, error.message);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 2 }} zIndex={100}>
        <Grid gridAutoColumns="1fr" container spacing={2}>
          {participants.map((user) => (
            <Grid
              onClick={() => removeParticipant(user)}
              key={user.id}
              xs={6}
              md={4}
              sx={{
                cursor: "pointer",
              }}
            >
              <Item sx={{ ":hover": { backgroundColor: "#28323d" } }}>
                {user.username}
              </Item>
            </Grid>
          ))}
        </Grid>

        <form onSubmit={createConversationHandler}>
          {participants.length > 1 && (
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              label="Conversation Name"
              variant="outlined"
            />
          )}
          <LoadingButton
            sx={{
              mt: 2,
              backgroundColor: "#33bfff",
              ":hover": { backgroundColor: "#2196f3" },
            }}
            disabled={participants.length > 1 && conversationName.length < 1}
            fullWidth
            loading={createConversationLoading}
            variant="contained"
            loadingPosition="center"
            type="submit"
          >
            <span>Create Conversation</span>
          </LoadingButton>
        </form>
      </Box>
    </>
  );
};

export default Participants;
