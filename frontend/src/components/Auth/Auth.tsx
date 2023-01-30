import { Button, OutlinedInput, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface IAuthProps {
  session: Session | null;
  refetch: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, refetch }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    try {
      /**
       * create username mutation to send username to GraphQL api
       */
    } catch (error) {
      console.log("onSubmit error", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}
      >
        {session ? (
          <>
            <Typography variant="h4">Create a Username</Typography>
            <OutlinedInput
              fullWidth
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></OutlinedInput>
            <Button fullWidth onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4">ChatQL</Typography>
            <Button
              onClick={() => signIn("google")}
              size="small"
              variant="contained"
              startIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

const GoogleIcon = () => {
  return (
    <Image
      width="20"
      height="20"
      src="/images/google.png"
      alt="Google-Logo"
    ></Image>
  );
};

export default Auth;
