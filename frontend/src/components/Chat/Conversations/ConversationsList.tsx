import { Box, Input, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { Session } from "next-auth";
import SearchIcon from "@mui/icons-material/Search";

interface IConversationsListProps {
  session: Session;
}

const boxSX = {
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
};

const ConversationsList: React.FunctionComponent<IConversationsListProps> = ({
  session,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const focusRef = () => ref.current?.focus();

  // const [isOpen, setIsOpen] = useState(false);

  // const onOpen = () => {
  //   setIsOpen(true);
  // };

  // const onClose = () => {
  //   setIsOpen(false);
  // };

  return (
    <Box width="100%">
      <Box
        sx={boxSX}
        height={50}
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
            mr: 3,
            ml: 2,
            my: 0.5,
            cursor: "pointer",
          }}
        />
        <TextField
          inputRef={ref}
          InputProps={{
            disableUnderline: true, // <== added this
            style: {
              height: "50px",
            },
          }}
          placeholder="Search or start new chat"
          fullWidth
          variant="standard"
        />
      </Box>
      {/* <ModalComponent open={isOpen} onClose={onClose} /> */}
    </Box>
  );
};

export default ConversationsList;
