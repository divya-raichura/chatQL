import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { SearchedUser } from "@/util/types";

interface IParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (user: SearchedUser) => void;
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
  removeParticipant,
}) => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <Grid container spacing={2}>
          {participants.map((user) => (
            <Grid
              onClick={() => removeParticipant(user)}
              key={user.id}
              xs={3}
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
        <Button
          fullWidth
          sx={{
            backgroundColor: "#33bfff",
            mt: 1,
            ":hover": { backgroundColor: "#2196f3" },
          }}
          variant="outlined"
        >
          Create Conversation
        </Button>
      </Box>
    </>
  );
};

export default Participants;
