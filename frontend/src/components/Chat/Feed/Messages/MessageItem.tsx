import { getMessageStructure } from "@/util/types";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { formatRelative } from "date-fns";
import * as React from "react";
import enUS from "date-fns/locale/en-US";

interface IMessageItemProps {
  message: getMessageStructure;
  sentByMe: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

const MessageItem: React.FunctionComponent<IMessageItemProps> = ({
  message,
  sentByMe,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent={sentByMe ? "flex-end" : "flex-start"}
      sx={{ width: "100%", ":hover": { backgroundColor: "#424242" } }}
    >
      <Stack
        sx={{
          backgroundColor: sentByMe ? "#3f51b5" : "RGBA(255, 255, 255, 0.16)",
          borderRadius: "10px",
          padding: "5px 10px",
          maxWidth: "70%",
          minWidth: "30%",
          margin: "5px 0",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {message.text}
        </Typography>
        <Typography
          sx={{
            color: sentByMe ? "#BDBDBD" : "#fff",
            fontSize: "10px",
            alignSelf: "flex-end",
            fontWeight: "500",
          }}
        >
          {formatRelative(new Date(message.createdAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default MessageItem;

// return (
//   <div
//     className={`message-item ${
//       sentByMe ? "message-item--sent" : "message-item--received"
//     }`}
//   >
//     <div className="message-item__content">
//       <div className="message-item__content__text">{message.text}</div>
//       <div className="message-item__content__time">{message.createdAt}</div>
//     </div>
//   </div>
// );

// input
{
  /* <Box width="100%" py={6} px={4}>
  <Paper
    component="form"
    onSubmit={submitHandler}
  >
    <InputBase
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      sx={{ ml: 1, flex: 1 }}
      placeholder="Type a message"
    />
    <IconButton type="button" sx={{ p: "10px" }}>
      <FiSend color="white" fontSize={20} />
    </IconButton>
  </Paper>
</Box>; */
}
