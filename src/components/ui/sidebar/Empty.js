import React from 'react';

import { Drawer } from '@material-ui/core';

export default function Empty({ classNames }) {
  return (
    <div>
      <Drawer
        variant="persistent"
        open={false}
        // className={classNames.drawer}
        anchor="left"
        PaperProps={{ elevation: 5 }}
        classes={{ paper: classNames.drawerPaper }}
      />
    </div>
  );
}
