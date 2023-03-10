import { Box } from "@mui/material";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import GQL from "../../../graphql/operations/user";
import React from "react";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Conversation,
  SearchedUser,
  searchUserData,
  searchUserVariables,
} from "@/util/types";
import SearchList from "./SearchList";
import Participants from "./Participants";
import ListItem from "./ListItem";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";

interface IConversationsListProps {
  session: Session;
  getConversations?: Array<Conversation>;
  conversationLoading?: boolean;
  onClickConversation: (
    conversationId: string,
    hasSeenMessage: boolean
  ) => void;
}

const ConversationsList: React.FunctionComponent<IConversationsListProps> = ({
  session,
  getConversations,
  conversationLoading,
  onClickConversation,
}) => {
  const [search, setSearch] = useState<string>("");
  const [getUsers, { data: searchedUsersData, loading: searchUserLoading }] =
    useLazyQuery<searchUserData, searchUserVariables>(GQL.Queries.GET_USERS);
  const [participants, addParticipants] = useState<Array<SearchedUser>>([]);

  const router = useRouter();
  const { conversationId } = router.query;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const addParticipantsHandler = (user: SearchedUser) => {
    if (participants.find((p) => p.id === user.id)) {
      toast.error("User already added");
      return;
    }
    addParticipants((prev) => [...prev, user]);
    // setSearch("");
  };

  const removeParticipant = (user: SearchedUser) => {
    addParticipants((prev) => prev.filter((p) => p.id !== user.id));
  };

  useEffect(() => {
    if (search.length >= 1) {
      getUsers({ variables: { username: search } });
    }
  }, [search, getUsers]);

  return (
    <Box
      width="100%"
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <SearchBar search={search} handleInputChange={handleInputChange} />
      {searchUserLoading && <LinearProgress />}

      {participants.length > 0 && (
        <Participants
          participants={participants}
          setSearch={setSearch}
          addParticipants={addParticipants}
          removeParticipant={removeParticipant}
          session={session}
        />
      )}

      {searchedUsersData && (
        <SearchList
          search={search}
          data={searchedUsersData}
          addParticipantsHandler={addParticipantsHandler}
        />
      )}

      {conversationLoading && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </>
      )}

      {!conversationLoading &&
        !search &&
        getConversations &&
        getConversations?.length > 0 &&
        getConversations?.map((conversation) => {
          const participant = conversation.Participants.find(
            (p) => p.user.id === session?.user?.id
          );

          return (
            <ListItem
              onClickConversation={() =>
                onClickConversation(conversation.id, participant?.hasSeen!)
              }
              conversation={conversation}
              key={conversation.id}
              isSelected={conversationId === conversation.id}
              hasSeenMessage={participant?.hasSeen!}
            />
          );
        })}

      {!conversationLoading &&
        !search &&
        getConversations &&
        getConversations?.length == 0 && (
          <Box
          // sx={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   width: "100%",
          //   height: "100%",
          // }}
          >
            <h1>Search a User to start a conversation</h1>
          </Box>
        )}

      {/* add conversations to search */}
      {/* 
      {search && getConversations?.filter((item) => {

      })} */}
    </Box>
  );
};

export default ConversationsList;

// const [isOpen, setIsOpen] = useState(false);

// const onOpen = () => {
//   setIsOpen(true);
// };

// const onClose = () => {
//   setIsOpen(false);
// };

// {
/* <ModalComponent open={isOpen} onClose={onClose} /> */
// }
// {
/* {!search &&
        DATA_PRIMARY.map((item) => (
          <Box
            key={item.id}
            sx={boxSX}
            height={50}
            bgcolor="rgba(255, 255, 255, 0.15)"
            borderRadius={4}
            mb={2}
            display="flex"
            alignItems="center"
          >
            <Box
              sx={{
                color: "action.active",
                mr: 3,
                ml: 2,
                my: 0.5,
                cursor: "pointer",
              }}
            >
              {item.name}
            </Box>
          </Box>
        ))}

      {search &&
        DATA.filter((item) => {
          return item.name.includes(search);
        }).map((item) => (
          <Box
            key={item.id}
            sx={boxSX}
            height={50}
            bgcolor="rgba(255, 255, 255, 0.15)"
            borderRadius={4}
            mb={2}
            display="flex"
            alignItems="center"
          >
            <Box
              sx={{
                color: "action.active",
                mr: 3,
                ml: 2,
                my: 0.5,
                cursor: "pointer",
              }}
            >
              {item.name}
            </Box>
          </Box>
        ))} */
// }
