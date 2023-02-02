import { Box } from "@mui/material";
import { Session } from "next-auth";

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<IFeedWrapperProps> = ({
  session,
}) => {
  return (
    <Box height="100vh" width="100%" bgcolor="rgba(255, 255, 255, 0.06)">
      Feed Wrapper
    </Box>
  );
};

export default FeedWrapper;
