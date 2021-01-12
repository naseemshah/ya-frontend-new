import React from 'react';
import { NavLink} from 'react-router-dom';
import styled from 'styled-components'

import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';
import { getAutomaticTypeDirectiveNames } from 'typescript';

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
          // backgroundColor: '#F40136',
          textAlign: 'center',
          height: 'fit-content',
          width: '100%',
          maxWidth: '1500px',
          fontSize: '14px',
          paddingBottom: '10px',
          zIndex: 2,
          marginLeft: 'auto',
          marginRight:  'auto',
        }}
      > 
        <StyledWrapper>
        <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="nav-container">
            
            <div className="nav-logo"></div>
            <div  className="nav-links-container">
              {/* <LinkButton title="DAO" to="/dao/" /> */}
              <LinkButton title="Dashboard" to="/dashboard/" />
              {/* <LinkButton title="Liquidity" to="/pool/" /> */}
              {/* <LinkButton title="Regulation" to="/regulation/" /> */}
              <LinkButton title="Governance" to="/governance/" />
              {/* <LinkButton title="Trade" to="/trade/" /> */}
              {/* <LinkButton title="Coupons" to="/coupons/" /> */}
              {/* <Link to="/dashboard"></Link> */}

            </div>
            <div className="yai-connect-button">
              <ConnectButton hasWeb3={hasWeb3} user={user} setUser={setUser} />
            </div>
          </div>
        </div>
        </StyledWrapper>
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
      external="false"
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


let StyledWrapper = styled.div`
  .nav-container{
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    padding-right: 20px;
    @media only screen and (max-width: 690px) {
      flex-direction: column;
      align-items: center;
      /* padding-top: 0!important; */
      .yai-connect-button{
        margin-top: 20px;
      }
    }
    .nav-logo{
      width: 200px;
    }
    .nav-links-container{
      width: fit-content;
      background: white!important;
      border-radius: 50px;
      overflow: hidden;
      height: 100%;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.248);
      /* position: absolute!important;
      top: 50px;
      left: 50%;
      transform: translateX(-50%)!important; */
    }
  }
`