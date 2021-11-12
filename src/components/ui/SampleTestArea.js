import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Card, CardContent, CardActions, IconButton,
} from '@material-ui/core';
import CopyToClipboardButton from './CopyToClipboardButton';
import Icon from './icon/index';

const useStyles = makeStyles({
  root: {
    width: '90%',
    height: 'auto',
  },
  defaultCardContent: {
    padding: '4px 30px 20px 30px',
    wordBreak: 'break-word',
    // '&:last-child': {
    //  padding: '22.5px 30px 5.5px',
    // },
  },
  limitedCardContent: {
    height: '333.5px',
    padding: '4px 30px 0px 30px',
    overflow: 'hidden',
    wordBreak: 'break-word',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  },
  limitedCardContentExpanded: {
    padding: '4px 30px 0px 30px',
    wordBreak: 'break-word',
  },
  truncateInputContent: {
    WebkitLineClamp: 11,
  },
  truncateOutputTitle: {
    WebkitLineClamp: 11,
  },
  truncateOutputContent: {
    WebkitLineClamp: 10,
  },
  truncateNoteTitle: {
    WebkitLineClamp: 9,
  },
  truncateNoteContent: {
    WebkitLineClamp: 8,
  },
  title: {
    marginTop: '18.5px',
  },
  copyIcon: {
    display: 'inline-block',
    marginLeft: '7.5px',
    transform: 'translateY(-3.5px)',
  },
  content: {
    marginTop: '18.5px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
    paddingBottom: '20px',
  },
  hideTextOverflowCardContent: {
    height: '325px',
  },
  hideTextOverflowActions: {
    paddingTop: '24.5px',
  },
});

export default function SampleTestArea({ input, output, note = '' }) {
  const classes = useStyles();
  const ref = useRef();
  const inputRef = useRef();
  const outputRef = useRef();
  const noteRef = useRef();
  const [showExpandArrow, setShowExpandArrow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [truncatePosition, setTruncatePosition] = useState('');

  useEffect(() => {
    if (ref.current.clientHeight > 401.5) {
      if (!showExpandArrow) {
        setShowExpandArrow(true);
        setExpanded(false);

        if (inputRef.current.clientHeight >= 248) {
          setTruncatePosition('inputContent');
        } else if (inputRef.current.clientHeight >= 223) {
          setTruncatePosition('outputTitle');
        } else if (inputRef.current.clientHeight + outputRef.current.clientHeight >= 198) {
          setTruncatePosition('outputContent');
        } else if (inputRef.current.clientHeight + outputRef.current.clientHeight >= 148) {
          setTruncatePosition('noteTitle');
        } else if (
          inputRef.current.clientHeight + outputRef.current.clientHeight + noteRef.current.clientHeight
          >= 124
          // inputRef.current.clientHeight + noteRef.current.clientHeight >= 198
        ) {
          setTruncatePosition('noteContent');
        }
      }
    }
  }, [expanded, inputRef, noteRef, ref, showExpandArrow]);

  const handleExpand = (limited, isExpanded) => {
    if (limited) {
      if (isExpanded) {
        return classes.limitedCardContentExpanded;
      }
      return classes.limitedCardContent;
    }
    return classes.defaultCardContent;
  };
  const handleTruncate = (position) => {
    switch (position) {
      case 'inputContent':
        return classes.truncateInputContent;
      case 'outputTitle':
        return classes.truncateOutputTitle;
      case 'outputContent':
        return classes.truncateOutputContent;
      case 'noteTitle':
        return classes.truncateNoteTitle;
      case 'noteContent':
        return classes.truncateNoteContent;
      default:
        return classes.truncateInputContent;
    }
  };
  const handleHideTextOverflowCardContent = (position, isExpanded) => {
    if (position === 'inputContent') {
      if (!isExpanded) {
        return classes.hideTextOverflowCardContent;
      }
      return classes.limitedCardContentExpanded;
    }
    return classes.defaultCardContent;
  };
  const handleHideTextOverflowActions = (position, isExpanded) => {
    if (position === 'inputContent' && !isExpanded) {
      return classes.hideTextOverflowActions;
    }
    return classes.actions;
  };

  return (
    <div ref={ref}>
      <Card className={classes.root} variant="outlined">
        <CardContent
          className={`${handleExpand(showExpandArrow, expanded)}
          ${handleTruncate(truncatePosition)} ${handleHideTextOverflowCardContent(truncatePosition, expanded)}`}
        >
          {input && (
            <>
              <div className={classes.title}>
                <Typography variant="h6" display="inline">
                  Input
                </Typography>
                <div className={classes.copyIcon}>
                  <CopyToClipboardButton text={input} />
                </div>
              </div>
              <div className={classes.content} ref={inputRef}>
                <Typography variant="body1">
                  {input.split('\n').map((string) => (
                    <React.Fragment key={string}>
                      {string}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </div>
            </>
          )}
          {output && (
            <>
              <div className={classes.title}>
                <Typography variant="h6" display="inline">
                  Output
                </Typography>
                <div className={classes.copyIcon}>
                  <CopyToClipboardButton text={output} />
                </div>
              </div>
              <div className={classes.content} ref={outputRef}>
                <Typography variant="body1">
                  {output.split('\n').map((string) => (
                    <React.Fragment key={string}>
                      {string}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </div>
            </>
          )}
          {note && (
            <>
              <div className={classes.title}>
                <Typography variant="h6" display="inline">
                  Note
                </Typography>
                <div className={classes.copyIcon}>
                  <CopyToClipboardButton text={note} />
                </div>
              </div>
              <div className={classes.content} ref={noteRef}>
                <Typography variant="body1">
                  {note.split('\n').map((string) => (
                    <React.Fragment key={string}>
                      {string}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </div>
            </>
          )}
        </CardContent>

        {showExpandArrow && (
          <CardActions className={`${classes.actions} ${handleHideTextOverflowActions(truncatePosition, expanded)}`}>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <Icon.ExpandLessOutlinedIcon /> : <Icon.ExpandMoreOutlinedIcon />}
            </IconButton>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
