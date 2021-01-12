import React, { useState } from 'react';
import { useWallet } from 'use-wallet';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import TotalBalance from "./TotalBalance";
import ConnectModal from './ConnectModal';
import { TokenClass } from 'typescript';

import TokenIcon from './tokenIcon.jpeg'

type connectButtonProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function ConnectButton({ hasWeb3, user, setUser }: connectButtonProps) {
  const { status, reset } = useWallet();

  const [isModalOpen, setModalOpen] = useState(false);

  const connectWeb3 = async (wallet) => {
    connect(wallet.ethereum);
    setUser(wallet.account);
  };

  const disconnectWeb3 = async () => {
    setUser('');
    reset();
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  return status === 'connected' ? (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1'}}/>
      <div>
        <Box padding={5} style={{width: '170px', borderRadius: 10}}>
          <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
            <LinkBase onClick={disconnectWeb3} style={{marginRight: '8px', height: '24px'}}>
                <IconPower />
            </LinkBase>
            {/* <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
              <img src={TokenIcon} style={{width: '20px', marginRight: '10px'}} alt="TokenIcon"/>
              <div>
                {user.substring(0,5)+"..."+user.substring(user.length-5,user.length)}
              </div>
            </div> */}
            <IdentityBadge entity={user} />
          </div>
          <TotalBalance user={user} />
          
        </Box>
      </div>
    </div>
  ) : (
    <>
      <ConnectModal visible={isModalOpen} onClose={toggleModal} onConnect={connectWeb3}/>
      {/* <Button icon={<IconConnect />} label="Connect" onClick={toggleModal} disabled={!hasWeb3}/> */}
      <Box padding={5} style={{width: '150px', padding: '5px', borderRadius: 10}}>
          <div 
            onClick={toggleModal}
            style={{display: 'flex',justifyContent: 'center',alignItems: 'center', cursor: 'pointer'}}>
          <IconConnect />Connect
          </div>
          
        </Box>
    </>
  );
}


export default ConnectButton;
