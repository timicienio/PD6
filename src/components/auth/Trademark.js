import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/auth.css';

export default function Trademark() {
  const [importantFunctionality, setImportantFunctionality] = useState(false);

  const onClickTrademark = () => {
    if (!importantFunctionality && Math.random() > 0.8) {
      setImportantFunctionality(true);
    } else setImportantFunctionality(false);
  };
  return (
    <div className="auth-trademark">
      <span
        className="auth-trademark-main"
        style={{
          fontSize: '2.4rem',
          lineHeight: 57 / 48,
          fontFamily: 'Azonix',
        }}
      >
        {importantFunctionality ? 'RDOGS 6.0' : 'PDOGS 6.0'}
      </span>
      <Typography className="auth-trademark-caption" variant="body1" onClick={onClickTrademark}>
        Department of Information Management,
        <br />
        National Taiwan University
        <br />
        2021 All rights reserved.
      </Typography>
    </div>
  );
}
