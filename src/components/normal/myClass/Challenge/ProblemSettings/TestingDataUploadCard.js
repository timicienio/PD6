import React, { useState } from 'react';
import {
  Typography,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core';
import AlignedText from '../../../../ui/AlignedText';
import IOFileUploadArea from '../../../../ui/IOFileUploadArea';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    marginBottom: '-8px',
  },
  instructions: {
    marginBottom: '10px',
  },
  sampleArea: {
    marginTop: '50px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  reminder: {
    color: theme.palette.grey.A700,
    marginLeft: theme.spacing(2),
  },
}));

export default function TestingDataUploadCard({
  popUp = false,
  closePopUp,
  selectedFile,
  setSelectedFile,
  handleTempUpload,
}) {
  const classes = useStyles();

  // const error = useSelector((state) => state.error);
  // const loading = useSelector((state) => state.loading.myClass.problem);

  const [time, setTime] = useState(1000);
  const [memory, setMemory] = useState(65535);
  const [score, setScore] = useState(2);

  const handleConfirm = () => {
    const newSelectedFile = Object.keys(selectedFile).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...selectedFile[key],
          no: selectedFile[key].id,
          score,
          time_limit: time,
          memory_limit: memory,
        },
      }),
      {},
    );
    handleTempUpload(newSelectedFile);
  };

  const handleCancel = () => {
    setSelectedFile([]);
    closePopUp();
  };
  return (
    <>
      <Dialog open={popUp} onClose={() => closePopUp()} maxWidth="md">
        <DialogTitle id="dialog-slide-title" className={classes.dialogTitle}>
          <Typography variant="h4">Upload Testing Data</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={classes.instructions}>
            <Typography variant="body2">Please name your files in the following manner:</Typography>
            <Typography variant="body2" className={classes.reminder}>
              1.in （測資 1 的 input）
            </Typography>
            <Typography variant="body2" className={classes.reminder}>
              1.out （測資 1 的 output）
            </Typography>
            <Typography variant="body2">
              Notice that PDOGS only accept files encoded in
              {' '}
              <b>ASCII / UTF-8</b>
              {' '}
              charset.
            </Typography>
          </div>
          <AlignedText text="Default Time (ms)" childrenType="field">
            <TextField id="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </AlignedText>
          <AlignedText text="Default Memory (kb)" childrenType="field">
            <TextField id="memory" value={memory} onChange={(e) => setMemory(e.target.value)} />
          </AlignedText>
          <AlignedText text="Default Score" childrenType="field">
            <TextField id="score" value={score} onChange={(e) => setScore(e.target.value)} />
          </AlignedText>
          <IOFileUploadArea
            text="Testing Data"
            uploadCase="testcase"
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="default">
            Cancel
          </Button>
          <Button disabled={Object.keys(selectedFile).length === 0} onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
