import React, { useState, useEffect } from 'react';

function Governance({ user }: {user: string}) {
  return (
    <div
      style={{
        background: '#F40136',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'

      }}
    >
      <h1 style={
        {
          fontSize: '30px',
          color: 'white',
          fontWeight: 'bold'
        }
      }>Coming Soon</h1>
    </div>
  );
}

export default Governance;
