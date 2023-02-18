import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useQuery } from "@apollo/client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getConversationsData } from "../../../../util/types";
import GQL from "../../../../graphql/operations/conversation";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useRouter } from "next/router";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import styled from "@emotion/styled";
// import SkeletonLoader from "../../../common/SkeletonLoader";

interface MessagesHeaderProps {
  //   userId: string;
  conversationId: string;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 180,
  },
}));

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ conversationId }) => {
  const router = useRouter();
  const { data: conversationData, loading: conversationLoading } = useQuery<
    getConversationsData,
    null
  >(GQL.Queries.GET_CONVERSATIONS);

  const conversation = conversationData?.getConversations.find(
    (conversation) => conversation.id === conversationId
  );

  //   if (data?.conversations && !loading && !conversation) {
  //     router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  //   }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        mx={3}
        mt={1}
        alignItems="center"
        height="60px"
      >
        <Button
          onClick={() =>
            router.replace("?conversationId", "/", {
              shallow: true,
            })
          }
          sx={{
            display: {
              xs: "block",
              sm: "none",
              md: "none",
              lg: "none",
            },
          }}
        >
          <AiOutlineArrowLeft color="white" fontSize={20} />
        </Button>

        {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />}
      {!conversation && !loading && <Text>Conversation Not Found</Text>} */}

        {conversation && (
          <Stack direction="row" alignItems="center" ml={2}>
            <AccountCircleIcon sx={{ color: "white" }} fontSize="large" />
            <Box ml={1.5}>
              <Typography
                sx={{
                  fontSize: "1.000rem",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {conversation.conversationName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.750rem",
                  fontWeight: "700",
                  color: "grey",
                }}
              >
                {conversation.Participants.length} members
              </Typography>
            </Box>
          </Stack>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <div>
          <Button
            onClick={handleClick}
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disableElevation
          >
            <BiDotsVerticalRounded color="white" fontSize={26} />
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} disableRipple>
              <Box display="flex" alignItems="center">
                <AiOutlineEdit />
                <Typography ml={0.5}>Edit</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleClose} disableRipple>
              <Box display="flex" alignItems="center">
                <BiLogOut />
                <Typography ml={0.5}>Leave</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleClose} disableRipple>
              <Box display="flex" alignItems="center">
                <MdDeleteOutline />
                <Typography ml={0.5}>Delete</Typography>
              </Box>
            </MenuItem>
          </StyledMenu>
        </div>
      </Stack>
      <Divider orientation="horizontal" flexItem />
    </>
  );
};
export default MessagesHeader;
