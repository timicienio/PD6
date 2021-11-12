import React from 'react';
import placeholderImg from './ui/icon/doge.png';

function NoMatch() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20vh',
        marginRight: 'calc(12.5% + 220px)',
        textAlign: 'center',
      }}
    >
      <img src={placeholderImg} style={{ width: '18vw', transform: 'translateX(-20px)' }} alt="404dog" />
      <h1 style={{ width: 'fit-content' }}>
        404 not found.
        {' '}
        <br />
        Wow, much emptiness.
      </h1>
    </div>
  );
}

export default NoMatch;
