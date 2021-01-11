import React from 'react';
import { NavLink} from 'react-router-dom';

import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean;
  user: string;
  setUser: Function;
};

function NavBar({ hasWeb3, user, setUser }: NavbarProps) {
  const currentTheme = useTheme();
  // const logoUrl = `./logo/logo_${currentTheme._name === 'light' ? 'black' : 'white'}.svg`;

  return (
    <>
      <div
        style={{
          borderTop: 'none',
          backgroundColor: 'rgba(0,0,0,0)',
          textAlign: 'center',
          height: 'fit-content',
          width: '100%',
          fontSize: '14px',
          paddingBottom: '10px'
        }}
      >
        <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', paddingTop: '24px', justifyContent: "space-between" }}>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <NavLink to="/" component={LinkBase} style={{ marginRight: '16px', height: '40px' }}>
                {/* <img src={logoUrl} height="40px" alt="Empty Set Dollar" /> */}
                <h1 
                  style={{
                    fontWeight: 'bold',
                    fontSize: '25px',
                    marginLeft: '10px'
                  }}
                >YAI FINANCE</h1>
              </NavLink>
            </div>
            <div style={{ display:'flex', height: '100%', maxWidth: '60%', textAlign: 'center', borderRadius: '50px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.186)'}}>
              {/* <LinkButton title="DAO" to="/dao/" /> */}
              <LinkButton title="Dashboard" to="/dashboard/" />
              {/* <LinkButton title="Liquidity" to="/pool/" /> */}
              {/* <LinkButton title="Regulation" to="/regulation/" /> */}
              <LinkButton title="Governance" to="/governance/" />
              {/* <LinkButton title="Trade" to="/trade/" /> */}
              {/* <LinkButton title="Coupons" to="/coupons/" /> */}
              {/* <Link to="/dashboard"></Link> */}

            </div>
            <div style={{textAlign: 'right', marginRight: '10px' }}>
              <ConnectButton hasWeb3={hasWeb3} user={user} setUser={setUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type linkButtonProps = {
  title: string;
  to: string;
};

function LinkButton({ title, to }: linkButtonProps) {
  
  return (
    <NavLink
      to={to}
      external={false}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '40px',
        opacity: 1,
        color: 'black',
        backgroundColor: 'white',
        padding: '5px 15px',
        textDecoration: 'none'
      }}
      activeStyle={{ color: 'white', backgroundColor: 'black', borderRadius: '50px'}}
    >
      <span style={{ display: 'block', padding: '1%', fontSize: '17px' }}>{title}</span>
    </NavLink>
  );
}

export default NavBar;
