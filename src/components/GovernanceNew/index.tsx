import React, { useState, useEffect } from 'react';
import yaiLogo from '../common/yai-logo.svg'


function Governance({ user }: {user: string}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img style={{
        zIndex:2,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: "200px"
        }} src={yaiLogo} alt="YAI Logo"/>
      <div
        style={{
          background: '#F40136',
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          height: '70vh',
          fontFamily: 'Roboto',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '1500px',
        }}
      > 
        <h1 style={
          {
            fontSize: '48px',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            marginTop: '100px'

          }
        }>Coming Soon</h1>
      </div>
    </div>
  );
}

export default Governance;
