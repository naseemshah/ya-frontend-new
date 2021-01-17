import React, {useState} from 'react';
import styled from 'styled-components';
import {approve, deposit, withdraw,purchaseCoupons} from '../../utils/web3';
import BigNumber from 'bignumber.js';
import {ESD, ESDS} from "../../constants/tokens";
import {isPos, toBaseUnitBN,toTokenUnitsBN} from '../../utils/number';
import { bond, unbondUnderlying } from '../../utils/web3';
import BalanceBlock from './BalanceBlock'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ToggleButton from 'react-toggle-button'
import {MAX_UINT256} from "../../constants/values";
import {getCouponPremium} from "../../utils/infura";




import {
    Box, Button, IconCirclePlus, IconCircleMinus, IconLock
  } from '@aragon/ui'



let handleApproveButton = (setIsApproved)=>{
    setIsApproved(true)
}

let handlePurchaseButton = (purchaseAmount) => {
    purchaseCoupons(
        ESDS.addr,
        toBaseUnitBN(purchaseAmount, ESD.decimals),
      );

}

let handleWithdrawButton = () =>{

}

let handleBondButton = () =>{

}

let handleUnBondButton = () =>{
    
}

type Props = {
    user: string
    balance: BigNumber,
    allowance: BigNumber,
    stagedBalance: BigNumber,
    status: number,
    userStagedBalance: BigNumber,
    userBondedBalance: BigNumber,
    setModal: Function,
    approve: Function,
    premium: BigNumber,
    debt: BigNumber
     
  };

const ManageCouponsModal = ({
    user, balance, allowance, stagedBalance, status,userStagedBalance,userBondedBalance,setModal, approve,premium,debt
  }: Props) => {
    let [isApproved,setIsApproved] = useState(false)
    let [isBondMode,setIsBondMode] = useState(true);
    
    const [premium2, setPremium] = useState(new BigNumber(0));

    let [withdrawAmount, setWithdrawAmount] =  useState(0)
    const [purchaseAmount, setPurchaseAmount] = useState(0);

    const updatePremium = async (purchaseAmount) => {
        if (purchaseAmount.lte(new BigNumber(0))) {
          setPremium(new BigNumber(0));
          return;
        }
        const purchaseAmountBase = toBaseUnitBN(purchaseAmount, ESD.decimals);
        const premium = await getCouponPremium(ESDS.addr, purchaseAmountBase)
        const premiumFormatted = toTokenUnitsBN(premium, ESD.decimals);
        setPremium(premiumFormatted);
      };



    return(
        <Modal className="yai-modal">
            <div className="yai-modal-header">
                <p>Manage Coupons</p>
                <div style={{cursor: 'pointer'}} onClick={()=>{setModal(false)}} className="fa fa-times"></div>
            </div>
            <div>

            </div>
            <Tabs className="yai-modal-tabs">
                <TabList className="yai-modal-tablist">
                    <Tab className="yai-modal-tab-item"><p>PURCHASE</p></Tab>
                    <Tab className="yai-modal-tab-item"><p>REDEEM</p></Tab>
                </TabList>
                <TabPanel className="yai-modal-tab-panel">
                    <div>
                        <div>
                            <div className="yai-card-content">
                                <p>Coupon Premium</p>
                                <p><BalanceBlock balance={premium.multipliedBy(100)} suffix={"%"}/></p>
                            </div>
                        </div>
                        {
                            allowance.comparedTo(MAX_UINT256) === 0 ? <div>
                                <input 
                                    className="yai-modal-input"
                                    onChange={(e)=>{
                                        
                                        setPurchaseAmount(parseFloat(e.target.value))
                                    }}
                                    type="number"/>
                                
                                <div
                                    className="yai-modal-button"
                                    onClick={()=>{
                                       handlePurchaseButton(purchaseAmount)
                                       
                                    
                                    }}
                                    >                
                                   {`Purchase ${purchaseAmount>0 ? purchaseAmount : ""}`}
                                </div>
                            </div> :<div
                            className="yai-modal-button"
                            onClick={()=>{approve()}}
                            >                
                            Approve
                        </div>
                        }
                        
                        <div>
                            <div className="yai-card-content">
                            <p>Balance</p>
                            <p>-.-- YAI</p>
                            </div>
                            <div className="yai-card-content">
                            <p>Debt</p>
                            <BalanceBlock  balance={debt} suffix={" YAI"}/>
                            </div> 
                            <div className="yai-card-content">
                            <p>Purchased</p>
                            <BalanceBlock  balance={0} suffix={" YAI"}/>
                            </div>
                        </div>
                    </div>
            
                </TabPanel>
                <TabPanel className="yai-modal-tab-panel">
                    <div>
                        <div>
                            <div className="yai-card-content">
                                <p>No Coupons to Display</p>
                            </div>                                
                        </div>
                        {
                            allowance.comparedTo(MAX_UINT256) === 0 ? <div>
                                <input 
                                    className="yai-modal-input"
                                    onChange={(e)=>{
                                        
                                        // isBondMode ? setBondAmount(parseFloat(e.target.value)) : setUnBondAmount(parseFloat(e.target.value))
                                    }}
                                    type="number"/>
                                
                                <div
                                    className="yai-modal-button"
                                    onClick={()=>{
                                    //    if(isBondMode) handleBondButton()
                                    //    else handleUnBondButton()
                                    
                                    }}
                                    >                
                                   {/* {isBondMode? `Bond ${bondAmount>0 ? bondAmount : ""}`:`UnBond ${unBondAmount>0 ? unBondAmount : ""}`} */}
                                </div>
                            </div> :<div
                            className="yai-modal-button"
                            onClick={()=>{approve()}}
                            >                
                            Approve
                        </div>
                        }
                        
                        <div>
                            <div className="yai-card-content">
                            <p>Balance</p>
                            <p>-.-- YAI</p>
                            </div>
                            <div className="yai-card-content">
                            <p>Debt</p>
                            <BalanceBlock  balance={0} suffix={" YAI"}/>
                            </div> 
                            <div className="yai-card-content">
                            <p>Purchased</p>
                            <BalanceBlock  balance={0} suffix={" YAI"}/>
                            </div>
                        </div>
                    </div>
            
                </TabPanel>
                
            </Tabs>
        </Modal>
    )
};


export default ManageCouponsModal;

let Modal = styled.div`
    width: 450px;
    height: fit-content;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow-y: auto;
    padding: 30px;
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.323);
    z-index: 50;
    border-radius: 20px;
    font-family: 'Roboto',sans-serif;
    .yai-modal-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        p{
            font-size: 30px;
            font-weight: bold;
        }
    }
    .yai-modal-choose{
        p{
            font-size: 25px;
            margin-top: auto;
            margin-bottom: auto;
            :first-child{
                margin-right: 20px;
            }
            :last-child{
                margin-left: 20px;
            }
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
    .yai-modal-button{
        width: 90%;
        border-radius: 10px;
        padding: 10px;
        background-color:rgba(214, 214, 214, 0.582);
        color: black;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 20px;
        :hover{
            background-color:rgba(189, 189, 189, 0.582);

        }
    }
    .yai-modal-input{
        margin-top: 20px;
        height: 45px;
        width: 100%;
        outline: none;
        border: solid 0.5 black;
        font-size: 25px;
        padding: 10px;
        border-radius: 10px;
                
    }

    @media only screen and (max-width: 550px){
        width: 300px!important;
        left: 50%;
        top: 50%;
        transform: translate(-53%,-50%);
        margin: 0;
        .yai-modal-choose{
            p{
                font-size: 18px;
                margin-top: auto;
                margin-bottom: auto;
                :first-child{
                    margin-right: 15px;
                }
                :last-child{
                    margin-left: 15px;
                }
            }
        }
        .yai-modal-header{
            p{
                font-size: 25px;
                font-weight: bold;
            }
        }
        .yai-modal-tab-item{
            p{
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin: auto; 
            }
        }
    }


`