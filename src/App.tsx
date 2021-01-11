import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import { HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { Main, Layout } from '@aragon/ui';
import { UseWalletProvider } from 'use-wallet';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Trade from './components/Trade/index';
import Wallet from "./components/Wallet";
import EpochDetail from "./components/EpochDetail";
import CouponMarket from "./components/CouponMarket";
import GovernanceNew from "./components/GovernanceNew";
import Candidate from "./components/Candidate";
import Regulation from "./components/Regulation";
import Pool from "./components/Pool";
import HomePageNoWeb3 from "./components/HomePageNoWeb3";

import Dashboard from "./components/Dashboard/index";

function App() {
  const storedTheme = getPreference('theme', 'light');

  const [hasWeb3, setHasWeb3] = useState(false);
  const [user, setUser] = useState(''); // the current connected user
  const [theme, setTheme] = useState(storedTheme);

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    updateModalMode(newTheme);
    storePreference('theme', newTheme);
  };

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      if (!isCancelled) {
        // @ts-ignore
        setHasWeb3(typeof window.ethereum !== 'undefined');
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <Router>
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
          walletlink: {
            url: 'https://mainnet.eth.aragon.network/',
            appName:'Coinbase Wallet',
            appLogoUrl: ''
          }
        }}
      >
        <Main assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`}  theme={theme} layout={false}>
          <StyledBackground>
          <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
          
          {
            hasWeb3 ?
              <Switch>
                <Route path="/dashboard/"><Dashboard user={user}/></Route>
                <Route path="/dao/:override"><Wallet user={user}/></Route>
                <Route path="/dao/"><Wallet user={user}/></Route>
                <Route path="/epoch/"><EpochDetail user={user}/></Route>
                <Route path="/coupons/:override"><CouponMarket user={user}/></Route>
                <Route path="/coupons/"><CouponMarket user={user}/></Route>
                {/* <Route path="/governance/candidate/:candidate"><Candidate user={user}/></Route> */}
                <Route path="/governance/"><GovernanceNew user={user}/></Route>
                {/* <Route path="/governance/"><Governance user={user}/></Route> */}
                <Route path="/trade/"><Trade user={user}/></Route>
                <Route path="/regulation/"><Regulation user={user}/></Route>
                <Route path="/pool/:override"><Pool user={user}/></Route>
                <Route path="/pool/"><Pool user={user}/></Route>
                {/* <Route path="/"><HomePage user={user}/></Route> */}
                <Route path="/"><Redirect to="/dashboard" /></Route>
                
              </Switch>
              :<Switch>
                {/* <Route path="/"><Redirect to="/dashboard" /></Route> */}

                <Route path="/"><HomePageNoWeb3/></Route>
              </Switch>
          }
          
        </StyledBackground>
        </Main>
        <YaiFooter>
          <div className="yai-foooter-social-container">
              <Link to="#">
                <i className="fab fa-github fa-2x"/>
              </Link>
              <Link to="#">
                <i className="fab fa-twitter fa-2x"/>
              </Link>
              <Link to="#">
                <i className="fab fa-medium fa-2x"/>
              </Link>
              <Link to="#">
                <i className="fab fa-telegram fa-2x"/>
              </Link>
              <Link to="#">
                <i className="fab fa-discord fa-2x"/>
              </Link>
          </div>
        </YaiFooter>
      </UseWalletProvider>
    </Router>
  );
}


export default App;

let StyledBackground = styled.div`
  background-color: black;
  background-image: url('/headerimage.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: 1500px 500px;
  
`
let YaiFooter = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  opacity: 0;
  background-color: white;
  /* box-shadow: 0 0 50px rgba(0, 0, 0, 0.329); */
  i{
    margin-right: 10px;
    padding: 10px;
  }
  :hover{
    opacity: 1;
  } 
`
