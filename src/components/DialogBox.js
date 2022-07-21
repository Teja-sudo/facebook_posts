import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogBox({ buttonName = 'Add post', postsRefresh, textFieldValue = '',
    mutationCallback = () => { }, requiredParams = {} }) {
    const [open, setOpen] = React.useState(false);
     const [postText, setPostText] = React.useState(textFieldValue);

  const handleClickOpen = () => {
    setOpen(true);
  };

    const handleClose = (e) => {
    setOpen(false);
    };
    
    const handleSubmitAndClose = () => {
       const parameters={...requiredParams,postText:postText}
        mutationCallback(parameters);
         setOpen(false);
  }
  React.useEffect(() => {
    let ignore = false;
    setPostText(textFieldValue);
    return () => {
      ignore = true;
      setPostText('');
    }
  }, [buttonName, postsRefresh])

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {buttonName}
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{buttonName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write your post content here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Post text"
            type="text"
            value={postText}
            onChange={(e)=>setPostText(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitAndClose} color="primary">
            {buttonName}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}