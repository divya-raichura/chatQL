import { Box, Button, Typography } from "@mui/material";
import { Session } from "next-auth";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import GQL from "../../../graphql/operations/user";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Grid from "@mui/material/Unstable_Grid2";
import { toast } from "react-hot-toast";

interface IConversationsListProps {
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

const boxSX = {
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
};

const ConversationsList: React.FunctionComponent<IConversationsListProps> = ({
  session,
}) => {
  const [search, setSearch] = useState<string>("");
  const [getUsers, { data, loading }] = useLazyQuery(GQL.Queries.GET_USERS);
  const [participants, addParticipants] = useState<
    Array<{ username: string; id: string }>
  >([]);

  const ref = useRef<HTMLInputElement>(null);
  const focusRef = () => ref.current?.focus();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const addParticipantsHandler = (user: { username: string; id: string }) => {
    if (participants.find((p) => p.id === user.id)) {
      toast.error("User already added");
      return;
    }
    addParticipants((prev) => [
      ...prev,
      { username: user.username, id: user.id },
    ]);
  };

  const removeParticipant = (user: { username: string; id: string }) => {
    addParticipants((prev) => prev.filter((p) => p.id !== user.id));
  };

  console.log("data", data);

  useEffect(() => {
    if (search.length >= 1) {
      getUsers({ variables: { username: search } });
    }
  }, [search, getUsers]);

  return (
    <Box width="100%">
      <Box
        sx={boxSX}
        height={40}
        bgcolor="rgba(255, 255, 255, 0.15)"
        borderRadius={4}
        mb={2}
        display="flex"
        alignItems="center"
      >
        <SearchIcon
          onClick={focusRef}
          sx={{
            color: "action.active",
            mr: 1,
            ml: 2,
            my: 0.5,
            cursor: "pointer",
          }}
        />
        <TextField
          inputRef={ref}
          value={search}
          onChange={handleInputChange}
          InputProps={{
            disableUnderline: true, // <== added this
            style: {
              height: "40px",
            },
          }}
          placeholder="Search or start new chat"
          fullWidth
          variant="standard"
        />
      </Box>

      {participants.length > 0 && (
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <Grid gridAutoColumns="1fr" container spacing={2}>
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
      )}

      {loading && <Typography>Loading...</Typography>}

      {search && data && data.getUsers && (
        <Box>
          {data.getUsers.map((user: any) => (
            <Box
              key={user.id}
              sx={{
                ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                cursor: "pointer",
              }}
              height={50}
              bgcolor="rgba(255, 255, 255, 0.05)"
              borderRadius={4}
              mb={2}
              display="flex"
              alignItems="center"
              onClick={() => addParticipantsHandler(user)}
            >
              <Box
                sx={{
                  color: "action.active",
                  mr: 3,
                  ml: 2,
                  my: 0.5,
                }}
                display="flex"
              >
                <AccountCircleIcon sx={{ mr: 1 }} />
                {user.username
                  .split(search)
                  .map((text: string, index: number) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span style={{ color: "aqua" }}>{search}</span>
                      )}
                      {text}
                    </React.Fragment>
                  ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ConversationsList;

// const [isOpen, setIsOpen] = useState(false);

// const onOpen = () => {
//   setIsOpen(true);
// };

// const onClose = () => {
//   setIsOpen(false);
// };

// {
/* <ModalComponent open={isOpen} onClose={onClose} /> */
// }
// {
/* {!search &&
        DATA_PRIMARY.map((item) => (
          <Box
            key={item.id}
            sx={boxSX}
            height={50}
            bgcolor="rgba(255, 255, 255, 0.15)"
            borderRadius={4}
            mb={2}
            display="flex"
            alignItems="center"
          >
            <Box
              sx={{
                color: "action.active",
                mr: 3,
                ml: 2,
                my: 0.5,
                cursor: "pointer",
              }}
            >
              {item.name}
            </Box>
          </Box>
        ))}

      {search &&
        DATA.filter((item) => {
          return item.name.includes(search);
        }).map((item) => (
          <Box
            key={item.id}
            sx={boxSX}
            height={50}
            bgcolor="rgba(255, 255, 255, 0.15)"
            borderRadius={4}
            mb={2}
            display="flex"
            alignItems="center"
          >
            <Box
              sx={{
                color: "action.active",
                mr: 3,
                ml: 2,
                my: 0.5,
                cursor: "pointer",
              }}
            >
              {item.name}
            </Box>
          </Box>
        ))} */
// }
