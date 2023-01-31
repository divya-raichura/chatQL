import { createUsernameData, createUsernameVariables } from "@/util/types";
import { useMutation } from "@apollo/client";
import { Button, OutlinedInput, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";

interface IAuthProps {
  session: Session | null;
  refetch: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, refetch }) => {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    createUsernameData,
    createUsernameVariables
  >(UserOperations.Mutations.CREATE_USERNAME);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || username?.length < 3)
      return alert("Username must be at least 3 characters long");

    try {
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log("onSubmit error", error);
    }
  };

  console.log("here is the mutation responses", data, loading, error);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {session ? (
        <>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h4">Create a Username</Typography>
              <OutlinedInput
                fullWidth
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></OutlinedInput>
              <Button fullWidth type="submit" variant="contained">
                Save
              </Button>
            </Stack>
          </form>
        </>
      ) : (
        <>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={5}
          >
            <Typography variant="h4">ChatQL</Typography>
            <Button
              onClick={() => signIn("google")}
              size="small"
              variant="contained"
              startIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
          </Stack>
        </>
      )}
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
