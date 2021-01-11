import React, { useState, useEffect } from 'react';

function Governance({ user }: {user: string}) {
  return (
    <div
      style={{
        background: '#F40136',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '99vh',
        fontFamily: 'Roboto',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        maxWidth: '1500px'
      }}
    >
      <h1 style={
        {
          fontSize: '48px',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Roboto'

        }
      }>Coming Soon</h1>
    </div>
  );
}

export default Governance;
