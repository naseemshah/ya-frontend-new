import React, {useState} from 'react';
import styled from 'styled-components';
import {approve, deposit, withdraw} from '../../utils/web3';
import BigNumber from 'bignumber.js';
import {ESD, ESDS} from "../../constants/tokens";
import {isPos, toBaseUnitBN} from '../../utils/number';
import { bond, unbondUnderlying } from '../../utils/web3';
import BalanceBlock from './BalanceBlock'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


import {
    Box, Button, IconCirclePlus, IconCircleMinus, IconLock
  } from '@aragon/ui'

type Props = {
    user: string
    balance: BigNumber,
    allowance: BigNumber,
    stagedBalance: BigNumber,
    status: number,
    userStagedBalance: BigNumber,
    userBondedBalance: BigNumber,
    setModal: Function,
  };

const ManageDAOModal = ({
    user, balance, allowance, stagedBalance, status,userStagedBalance,userBondedBalance,setModal
  }: Props) => {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
    
    return(
        <Modal className="yai-modal">
            <div className="yai-modal-header">
                <p>Manage DAO</p>
                <div style={{cursor: 'pointer'}} onClick={()=>{setModal(false)}} className="fa fa-times"></div>
            </div>
            <Tabs className="yai-modal-tabs">
                <TabList className="yai-modal-tablist">
                    <Tab className="yai-modal-tab-item"><p>STAGE</p></Tab>
                    <Tab className="yai-modal-tab-item"><p>BOND</p></Tab>
                </TabList>
                <TabPanel className="yai-modal-tab-panel">
                    <div>
                        <div>
                            <div className="yai-card-content">
                                <p>Epoch Yield</p>
                                <p>--%</p>
                            </div>
                            <div className="yai-card-content">
                                <p>Cycle APY</p>
                                <p>--%</p>
                            </div>    
                        </div>
                        
                        <Button
                            wide
                            icon={<IconCirclePlus />}
                            label="Approve"
                            onClick={() => {
                                approve(ESD.addr, ESDS.addr);
                            }}
                            disabled={user === ''}
                            style={{margin: '15px 0', cursor: 'pointer'}}
                        />                        
                        <div>
                            <div className="yai-card-content">
                            <p>Wallet (Trade YAI)</p>
                            <p>--</p>
                            </div>
                            <div className="yai-card-content">
                            <p>Staged</p>
                            <p><BalanceBlock  balance={userStagedBalance} suffix={" YAI"}/></p>
                            </div> 
                            <div className="yai-card-content">
                            <p>Bonded</p>
                            <p><BalanceBlock  balance={userBondedBalance} suffix={" YAI"}/></p>
                            </div>
                        </div>
                    </div>
            
                </TabPanel>
                <TabPanel className="yai-modal-tab-panel">
                    <div>
                        <div>
                            <div className="yai-card-content">
                                <p>Epoch Yield</p>
                                <p>--%</p>
                            </div>
                            <div className="yai-card-content">
                                <p>Cycle APY</p>
                                <p>--%</p>
                            </div>    
                        </div>
                        TBD BUTTON HERE
                        {/* <Button
                            wide
                            icon={<IconCirclePlus />}
                            label="Approve"
                            onClick={() => {
                                approve(ESD.addr, ESDS.addr);
                            }}
                            disabled={user === ''}
                            style={{margin: '15px 0', cursor: 'pointer'}}
                        />                         */}
                        <div>
                            <div className="yai-card-content">
                            <p>Wallet (Trade YAI)</p>
                            <p>--</p>
                            </div>
                            <div className="yai-card-content">
                            <p>Staged</p>
                            <p><BalanceBlock  balance={userStagedBalance} suffix={" YAI"}/></p>
                            </div> 
                            <div className="yai-card-content">
                            <p>Bonded</p>
                            <p><BalanceBlock  balance={userBondedBalance} suffix={" YAI"}/></p>
                            </div>
                        </div>
                    </div>
            
                </TabPanel>
                
            </Tabs>
        </Modal>
    )
};


export default ManageDAOModal;

let Modal = styled.div`
    width: 450px;
    height: 80vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow-y: auto;
    padding: 15px;
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.323);
    .yai-modal-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        p{
            font-size: 30px;
        }
    }
    .yai-card-content{
      display: flex;
      font-size: 20px;
      margin: 0;
      justify-content: space-between;
      margin: 5px 0 5px 0;
      font-weight: bold;
    }
    .yai-modal-tablist{
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 15px;       
    }

    .yai-modal-tab-item{
        list-style: none;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.035);
        cursor: pointer;
        p{
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            margin: auto; 
        }
        :hover{
            background-color: black;
            color: white;
        }
    }
    .react-tabs__tab--selected{
        background-color: black;
        color: white;
    }


`