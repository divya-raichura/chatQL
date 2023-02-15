import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";

export interface ISearchBarProps {
  search: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const boxSX = {
  "&:hover": {
    backgroundColor: "#424242",
  },
};

export default function SearchBar({
  search,
  handleInputChange,
}: ISearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);
  const focusRef = () => ref.current?.focus();

  return (
    <Box
      boxShadow={3}
      sx={boxSX}
      width="100%"
      height={40}
      bgcolor="rgba(60,60,60,0.7)"
      borderRadius={3}
      mb={2}
      display="flex"
      alignItems="center"
    >
      <SearchIcon
        onClick={focusRef}
        sx={{
          color: "action.active",
          mr: 1,
          ml: 2,
          my: 0.5,
          cursor: "pointer",
        }}
      />
      <TextField
        inputRef={ref}
        value={search}
        sx={{
          color: "action.active",
          mr: 3,
          ml: 2,
          my: 0.5,
          wordWrap: "break-word",
        }}
        onChange={handleInputChange}
        InputProps={{
          disableUnderline: true, // <== added this
          style: {
            height: "40px",
          },
        }}
        placeholder="Search or start new chat"
        fullWidth
        variant="standard"
      />
    </Box>
  );
}
