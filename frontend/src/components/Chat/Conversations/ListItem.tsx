import { Box } from "@mui/material";
import { Conversation } from "@/util/types";

interface ListItemProps {
  conversation: Conversation;
}

const ListItem: React.FunctionComponent<ListItemProps> = ({ conversation }) => {
  return (
    <Box
      sx={{
        color: "action.active",
        mr: 3,
        ml: 2,
        my: 0.5,
      }}
    >
      {conversation.id}
    </Box>
  );
};

export default ListItem;
