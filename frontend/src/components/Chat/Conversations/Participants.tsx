import { Box } from "@mui/material";
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
import { Dispatch, SetStateAction } from "react";

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

  const router = useRouter();

  const userId = session.user.id;

  const createConversationHandler = async () => {
    try {
      // console.log("Create Conversation Mutation");

      const { data } = await createConversation({
        variables: {
          participantIds: [userId, ...participants.map((p) => p.id)],
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

      console.log(
        "here is participant frontend data recieved from backend",
        data
      );
    } catch (error: any) {
      console.log("onCreateConversation error", error);
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

        <LoadingButton
          loading={createConversationLoading}
          fullWidth
          sx={{
            backgroundColor: "#33bfff",
            mt: 1,
            ":hover": { backgroundColor: "#2196f3" },
          }}
          loadingPosition="center"
          variant="outlined"
          onClick={(e) => createConversationHandler()}
        >
          <span>Create Conversation</span>
        </LoadingButton>
      </Box>
    </>
  );
};

export default Participants;
