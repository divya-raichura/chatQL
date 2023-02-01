import { createUsernameData, createUsernameVariables } from "@/util/types";
import { useMutation } from "@apollo/client";
import { Button, OutlinedInput, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from "../../graphql/operations/user";

interface IAuthProps {
  session: Session | null;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session }) => {
  const [username, setUsername] = useState("");

  const [createUsername, { loading, error }] = useMutation<
    createUsernameData,
    createUsernameVariables
  >(UserOperations.Mutations.CREATE_USERNAME);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || username?.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    try {
      console.log("HERE IS THE SESSION IN FRONTEND", session);

      let { data } = await createUsername({ variables: { username } });

      console.log(data);

      if (!data?.createUsername) {
        throw new Error();
      } else if (
        data?.createUsername?.error ||
        !data?.createUsername?.success
      ) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      if (data.createUsername.success) {
        toast.success("Username created successfully 🚀");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error?.message);
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
              size="medium"
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
