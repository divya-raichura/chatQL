import * as React from "react";
import { searchUserData, SearchedUser } from "@/util/types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box } from "@mui/material";

interface ISearchListProps {
  search: string;
  data: searchUserData;
  addParticipantsHandler: (user: SearchedUser) => void;
}

const SearchList: React.FunctionComponent<ISearchListProps> = ({
  search,
  data,
  addParticipantsHandler,
}) => {
  return (
    <>
      {search && data && data.getUsers && (
        <Box>
          {data.getUsers.map((user: SearchedUser) => (
            <Box
              key={user.id}
              sx={{
                ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                cursor: "pointer",
              }}
              height={50}
              bgcolor="rgba(255, 255, 255, 0.05)"
              borderRadius={4}
              mb={2}
              display="flex"
              alignItems="center"
              boxShadow={8}
              onClick={() => addParticipantsHandler(user)}
            >
              <Box
                sx={{
                  color: "action.active",
                  mr: 3,
                  ml: 2,
                  my: 0.5,
                }}
                display="flex"
                alignItems="center"
              >
                {/* icon */}
                <AccountCircleIcon sx={{ mr: 1 }} />

                {/* highlight text */}
                {user.username.split(search).map((text, index) => (
                  <React.Fragment key={index}>
                    {text}
                    {index !== user.username.split(search).length - 1 && (
                      <Box
                        component="span"
                        sx={{
                          color: "action.active",
                          fontWeight: "bold",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: 4,
                          px: 0.5,
                        }}
                      >
                        {search}
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default SearchList;
