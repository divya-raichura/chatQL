import Auth from "@/components/Auth/Auth";
import Chat from "@/components/Chat/Chat";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const { data: session } = useSession();

  // ts knows that data or session is of type Session from next-auth which has name, email, image
  // to add more properties to it we need to modify Session interface
  // the Session interface extends DefaultSession which has user properties and expires in
  // we will create custom type decoration file for this in lib: next-auth.d.ts

  // all the types we create in this file will be interpreted as types coming from next-auth itself
  return (
    <div>
      {session?.user.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/auth",
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
