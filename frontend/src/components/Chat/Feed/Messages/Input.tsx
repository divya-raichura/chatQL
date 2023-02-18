import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { FiSend } from "react-icons/fi";
import { Box } from "@mui/material";
import { toast } from "react-hot-toast";

interface IInputProps {
  conversationId: string;
}

const Input: React.FunctionComponent<IInputProps> = ({ conversationId }) => {
  const [message, setMessage] = React.useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TODO: send message
    } catch (error: any) {
      console.log("send message error", error);
      toast.error(error.message);
    }
  };

  return (
    <Box width="100%" py={6} px={4}>
      <Paper
        component="form"
        onSubmit={submitHandler}
        sx={{
          backgroundColor: "#1e1e1e",
          // border color to match the elevation
          borderColor: "#1e1e1e",
          // shadow to match the elevation of the app bar
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
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
    </Box>
  );
};

export default Input;
