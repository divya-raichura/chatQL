import { GetServerSideProps, NextPageContext } from "next";
import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <img
          src={session.user?.image as string}
          alt="Picture of the author"
          width={50}
          height={50}
        />
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      session,
    },
  };
};
