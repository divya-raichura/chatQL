import { Box } from "@mui/material";
import { Conversation } from "@/util/types";

interface ListItemProps {
  conversation: Conversation;
  onClickConversation: (conversationId: string) => void;
  isSelected: boolean;
}

const boxSX = {
  "&:hover": {
    backgroundColor: "#424242",
  },
};

const ListItem: React.FunctionComponent<ListItemProps> = ({
  conversation,
  onClickConversation,
  isSelected,
}) => {
  return (
    <Box
      borderBottom="1px solid #616161"
      sx={{ cursor: "pointer", ...boxSX }}
      height={65}
      borderRadius={1}
      mb={1}
      style={{
        backgroundColor: isSelected ? "#616161" : "rgba(60,60,60,0.9)",
      }}
      display="flex"
      alignItems="center"
      onClick={() => onClickConversation(conversation.id)}
    >
      <Box
        sx={{
          color: "action.active",
          mr: 3,
          ml: 2,
          my: 0.5,
          wordWrap: "break-word",
        }}
      >
        {conversation.id}
      </Box>
    </Box>
  );
};

export default ListItem;
