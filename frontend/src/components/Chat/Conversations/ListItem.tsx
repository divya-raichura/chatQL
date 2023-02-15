import { Box, Stack, Typography } from "@mui/material";
import { Conversation } from "@/util/types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { formatRelative } from "date-fns";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import enUS from "date-fns/locale/en-US";

interface ListItemProps {
  conversation: Conversation;
  onClickConversation: (conversationId: string) => void;
  isSelected: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

const boxSx = {
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.010)",
  },
  boxShadow: 3,
};

const ListItem: React.FunctionComponent<ListItemProps> = ({
  conversation,
  onClickConversation,
  isSelected,
}) => {
  return (
    <Box width="100%">
      <Box
        sx={boxSx}
        width="100%"
        height={65}
        borderRadius={3}
        mb={1}
        style={{
          backgroundColor: isSelected ? "#039BE5" : "rgb(45, 45, 45)",
        }}
        display="flex"
        alignItems="center"
        onClick={() => onClickConversation(conversation.id)}
      >
        <Box
          sx={{
            width: "95%",
            color: "action.active",
            mr: 3,
            ml: 0.5,
            my: 0.5,
            wordWrap: "break-word",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                width: "80%",
                height: "100%",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <GoPrimitiveDot fontSize={18} color="#6B46C1" />
              <AccountCircleIcon fontSize="large" />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                  height: "100%",
                }}
              >
                <Typography
                  ml={1}
                  sx={{ fontSize: "0.900rem", fontWeight: "700" }}
                >
                  {conversation.conversationName}
                </Typography>
                {!conversation.latestMessage && (
                  <Box width="110%">
                    <Typography
                      ml={1}
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontSize: "0.700rem",
                        fontWeight: "700",
                        color: isSelected ? "white" : "grey",
                      }}
                    >
                      {/* {conversation.latestMessage} */}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempore architecto dolorem quos omnis illo repudiandae
                      reiciendis veniam ex laborum aliquid!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "0.700rem",
                fontWeight: "700",
                color: isSelected ? "white" : "grey",
              }}
            >
              {formatRelative(new Date(conversation.updatedAt), new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) =>
                    formatRelativeLocale[
                      token as keyof typeof formatRelativeLocale
                    ],
                },
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListItem;

{
  /* <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
  <AccountCircleIcon fontSize="large" />
  <Typography
    variant="subtitle2"
    gutterBottom
    style={{ fontWeight: isSelected ? "bold" : "normal", fontSize: 16 }}
  >
    {conversation.conversationName}
  </Typography>
  <Typography sx={{ alignSelf: "flex-end" }}>
    
  </Typography>
</Stack>; */
}
