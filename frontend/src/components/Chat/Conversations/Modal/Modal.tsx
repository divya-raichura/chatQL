import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { OutlinedInput } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface IModalComponentProps {
  open: boolean;
  onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ marginRight: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const ModalComponent: React.FC<IModalComponentProps> = ({ open, onClose }) => {
  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Search for a user
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={(e) => {}}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <OutlinedInput
                fullWidth
                placeholder="Enter a username"
              ></OutlinedInput>
              <LoadingButton
                loadingPosition="start"
                fullWidth
                type="submit"
                variant="contained"
              >
                <span>Search</span>
              </LoadingButton>
            </Stack>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default ModalComponent;
