import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import BigNumber from 'bignumber.js';
import yaiLogo from '../common/yai-logo.svg'
import headerImage from './headerimage.png'
import ConnectWalletButton from '../NavBar/ConnectButton';

import {
  getBalanceBonded,
  getBalanceOfStaged, getFluidUntil, getLockedUntil,
  getStatusOf, getTokenAllowance,
  getTokenBalance, getTokenTotalSupply, getTotalRedeemable,getEpochTime
} from '../../utils/infura';
import {
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolStatusOf, getPoolTotalBonded,
  getPoolFluidUntil
} from '../../utils/infura';
import {ESD, ESDS, UNI, USDC} from "../../constants/tokens";
import {DAO_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';
 
import {isPos, toBaseUnitBN} from '../../utils/number';
import AccountPageHeader from "./Header";
import WithdrawDeposit from "./WithdrawDeposit";
import {approve, deposit, withdraw,bond,unbondUnderlying} from '../../utils/web3';
import BondUnbond from "./BondUnbond";
import {getLegacyPoolAddress,getPoolAddress} from "../../utils/pool";
//import {DollarPool4} from "../../constants/contracts";
import {POOL_EXIT_LOCKUP_EPOCHS} from "../../constants/values";

import BalanceBlock from './BalanceBlock'
import ManageDAOModel from './ManageDAOModel'
import ManageLPModal from './ManageLPModal'
import ManageCouponsModal from './ManageCouponsModal'
import ManageRewardsModal from './ManageRewardsModal'


  function epochformatted(epochTime) {
   

  const epochPeriod = 30 * 60 ;
  const epochStart = 1608422400;  
  const hour = 60 * 60;
  const minute = 60;
  let epochRemainder =  parseInt(epochTime, 10) *epochPeriod

  epochRemainder=epochRemainder+epochStart
  epochRemainder=Math.floor(Date.now() / 1000)-epochRemainder
  epochRemainder=epochPeriod-epochRemainder
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
 

 
  return `${epochHour}:${epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()}:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

function Dashboard({ hasWeb3, user, setUser }: { hasWeb3: boolean, user: string, setUser: Function}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }
  const ApproveDAO=()=>{
    approve(ESD.addr, ESDS.addr)
  } 
  const DepostYAIToDAO=(depositAmount)=>{
    deposit(
      ESDS.addr,
      toBaseUnitBN(depositAmount , ESD.decimals))
     
  }
  const WithdrawYAIFromDAO=(withdrawAmount)=>{
    withdraw(
      ESDS.addr,
      toBaseUnitBN(withdrawAmount, ESD.decimals),
    )
     
  }
  const BondYAITODAO=(bondAmount)=>{
    bond(
      ESDS.addr,
      toBaseUnitBN(bondAmount, ESD.decimals),
    );
  }
  const UnbondYAIFromDAO=(unbondAmount)=>{
    unbondUnderlying(
      ESDS.addr,
      toBaseUnitBN(unbondAmount, ESD.decimals),
    )
  }
  const [epochTime, setEpochTime] = useState("00:00:00");
  const [userESDBalance, setUserESDBalance] = useState(new BigNumber(0));
  const [userESDAllowance, setUserESDAllowance] = useState(new BigNumber(0));
  const [userESDSBalance, setUserESDSBalance] = useState(new BigNumber(0));
  const [totalESDSupply, setTotalESDSupply] = useState(new BigNumber(0));
  const [totalESDSSupply, setTotalESDSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);
  const [redeemable, setRedeemable] = useState(new BigNumber(0));

  const [isManageDAOModal,setIsManageDAOModal] = useState(false);
  const [isManageLPModal,setIsManageLPModal] = useState(false);
  const [isManageCoupons,setIsManageCoupons] = useState(false);
  let [isManageRewardsModal,setIsManageRewardsModal] = useState(false)

  
  const [poolAddress, setPoolAddress] = useState("");
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userUSDCBalance, setUserUSDCBalance] = useState(new BigNumber(0));
  const [userUSDCAllowance, setUserUSDCAllowance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(new BigNumber(0));
  const [userClaimableBalance, setUserClaimableBalance] = useState(new BigNumber(0));
  const [poolUserStagedBalance, setPoolUserStagedBalance] = useState(new BigNumber(0));
  const [poolUserBondedBalance, setPoolUserBondedBalance] = useState(new BigNumber(0));
  const [poolUserRewardedBalance, setPoolUserRewardedBalance] = useState(new BigNumber(0));
  const [poolUserClaimableBalance, setPoolUserClaimableBalance] = useState(new BigNumber(0));
  const [poolUserStatus, setPoolUserStatus] = useState(0);
  const [poolFluidUntil,setPoolFluidUntil]=useState(0);
 
  //Update User balances
  useEffect(() => {
    

    if (user === '') {
      setUserESDBalance(new BigNumber(0));
      setUserESDAllowance(new BigNumber(0));
      setUserESDSBalance(new BigNumber(0));
      setTotalESDSupply(new BigNumber(0));
      setTotalESDSSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setRedeemable(new BigNumber(0));      
      setUserStatus(0);
      setIsManageDAOModal(false)
      setPoolAddress("");
      setPoolTotalBonded(new BigNumber(0));
      setPairBalanceESD(new BigNumber(0));
      setPairBalanceUSDC(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserUSDCBalance(new BigNumber(0));
      setUserUSDCAllowance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      setUserClaimableBalance(new BigNumber(0));
      setUserStatus(0);
      setUserStatusUnlocked(0);
      setPoolUserStagedBalance(new BigNumber(0));
      setPoolUserBondedBalance(new BigNumber(0));
      setPoolUserRewardedBalance(new BigNumber(0));
      setPoolUserClaimableBalance(new BigNumber(0));
      setPoolUserStatus(0);
      return;
    }
    let isCancelled = false;

    
    async function updateUserInfo() {
       
       
      const poolAddressStr = await getPoolAddress();
    
      //const legacyPoolAddress = getLegacyPoolAddress(poolAddressStr);
      const [esdBalance,
             esdAllowance,
             esdsBalance,
             esdSupply,
             esdsSupply,
             stagedBalance,
             bondedBalance,
             status, 
             fluidUntilStr,
             lockedUntilStr,
             redeemableStr,
             poolTotalBondedStr,
             pairBalanceESDStr,
             pairBalanceUSDCStr,
             uniBalance,
             usdcBalance,
             allowance,
             usdcAllowance,
             poolStagedBalance,
             poolBondedBalance,
             poolRewardedBalance,             
             poolClaimableBalance,             
             poolStatus,
             FluidUntil
      ] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getTokenAllowance(ESD.addr, user, ESDS.addr),
        getTokenBalance(ESDS.addr, user),
        getTokenTotalSupply(ESD.addr),
        getTokenTotalSupply(ESDS.addr),
        getBalanceOfStaged(ESDS.addr, user),
        getBalanceBonded(ESDS.addr, user),
        getStatusOf(ESDS.addr, user),
         
        getFluidUntil(ESDS.addr, user),
        getLockedUntil(ESDS.addr, user),
        getTotalRedeemable(ESDS.addr),
        getPoolTotalBonded(poolAddressStr),
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
        getTokenBalance(UNI.addr, user),
        getTokenBalance(USDC.addr, user),
        getTokenAllowance(UNI.addr, user, poolAddressStr),
        getTokenAllowance(USDC.addr, user, poolAddressStr),
        getPoolBalanceOfStaged(poolAddressStr, user),
        getPoolBalanceOfBonded(poolAddressStr, user),
        getPoolBalanceOfRewarded(poolAddressStr, user),
        getPoolBalanceOfClaimable(poolAddressStr, user),
        getPoolStatusOf(poolAddressStr, user),
        getPoolFluidUntil(poolAddressStr, user),


       

      ]);
         
      const userESDBalance = toTokenUnitsBN(esdBalance, ESD.decimals);
      const userESDSBalance = toTokenUnitsBN(esdsBalance, ESDS.decimals);
      const totalESDSupply = toTokenUnitsBN(esdSupply, ESD.decimals);
       
      const totalESDSSupply = toTokenUnitsBN(esdsSupply, ESDS.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, ESDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, ESDS.decimals);
      const totalRedeemable = toTokenUnitsBN(redeemableStr, ESD.decimals);
      const userStatus = parseInt(status, 10);
      
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, ESD.decimals);
      const pairESDBalance = toTokenUnitsBN(pairBalanceESDStr, ESD.decimals);
      const pairUSDCBalance = toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals);
      const userUNIBalance = toTokenUnitsBN(uniBalance, UNI.decimals);
      const userUSDCBalance = toTokenUnitsBN(usdcBalance, USDC.decimals);
      const userRewardedBalance = toTokenUnitsBN(poolRewardedBalance, ESD.decimals);
      const userClaimableBalance = toTokenUnitsBN(poolClaimableBalance, ESD.decimals);
      const legacyUserStagedBalance = toTokenUnitsBN(poolStagedBalance, UNI.decimals);
      const legacyUserBondedBalance = toTokenUnitsBN(poolBondedBalance, UNI.decimals);
      const legacyUserRewardedBalance = toTokenUnitsBN(poolRewardedBalance, UNI.decimals);
      const legacyUserClaimableBalance = toTokenUnitsBN(poolClaimableBalance, ESD.decimals);
      const legacyUserStatus = parseInt(poolStatus, 10);
      
 
      if (!isCancelled) {
        const epochTime=await getEpochTime(ESDS.addr)
        setEpochTime(epochformatted(epochTime))
        setUserESDBalance(new BigNumber(userESDBalance));
        setUserESDAllowance(new BigNumber(esdAllowance));
        setUserESDSBalance(new BigNumber(userESDSBalance));
        setTotalESDSupply(new BigNumber(totalESDSupply));
        setTotalESDSSupply(new BigNumber(totalESDSSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setRedeemable(new BigNumber(totalRedeemable));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil))
  /*       setLockup(poolAddress === DollarPool4 ? DAO_EXIT_LOCKUP_EPOCHS : 1); */
        setPoolAddress(poolAddressStr);
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setPairBalanceESD(new BigNumber(pairESDBalance));
        setPairBalanceUSDC(new BigNumber(pairUSDCBalance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserUNIAllowance(new BigNumber(allowance));
        setUserUSDCAllowance(new BigNumber(usdcAllowance));
        setUserUSDCBalance(new BigNumber(userUSDCBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
        setUserClaimableBalance(new BigNumber(userClaimableBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(fluidUntil);
        setPoolUserStagedBalance(new BigNumber(legacyUserStagedBalance));
        setPoolUserBondedBalance(new BigNumber(legacyUserBondedBalance));
        setPoolUserRewardedBalance(new BigNumber(legacyUserRewardedBalance));
        setPoolUserClaimableBalance(new BigNumber(legacyUserClaimableBalance));
        setPoolUserStatus(legacyUserStatus);

         
        //setLockup(poolAddressStr === DollarPool4 ? POOL_EXIT_LOCKUP_EPOCHS : 1);
      }
    }

   

    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);
    // eslint-disable-next-line consistent-return
   
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  // Check for error in .call()
  const isRewardedNegative = poolUserRewardedBalance.isGreaterThan(new BigNumber("1000000000000000000"));
  const hasLegacyBalance = poolUserStagedBalance.isGreaterThan(0) || poolUserClaimableBalance.isGreaterThan(0) || poolUserBondedBalance.isGreaterThan(0);
  
  let formatNumber = (number) =>{
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    
    return formatter.format(number);
  }

  return (
    <>
      <StyledDashboardInfo>

        {/* <img className="headerImage" src={headerImage} alt="YAI Logo"/> */}
        <img style={{zIndex:2}} src={yaiLogo} alt="YAI Logo"/>
        <div className="yai-dash-total-container">
          <p className="yai-dash-total-title">YAI TOTAL SUPPLY</p>
          <p className="yai-dash-total-value">{totalESDSupply.toNumber().toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
        </div>
        <div className="yai-dash-info-container">
          <p>1 YAI =  --.--- DAI</p>
          <p>SPOT PRICE ¥---</p>
          <p>NEXT EPOCH {epochTime}</p>

        </div>

      </StyledDashboardInfo>
      <StyledDashboardSection>
        <div className="yai-card">
          <h3 className="yai-card-title">Supply</h3>
          <div style={{marginBottom: '10px'}}>
            <h5 className="yai-card-subtitle">DAO</h5>
            <div className="yai-card-content">
              <p>Epoch Yield</p>
              <p>--%</p>
            </div>
            <div className="yai-card-content">
              <p>Cycle APY</p>
              <p>--%</p>
            </div>    
          </div>
          <div>
            <div className="yai-card-content">
              <p>Wallet (Trade YAI){userESDBalance.toNumber()}</p>
              <p>--</p>
            </div>
            <div className="yai-card-content">
              <p>Staged</p>
              <BalanceBlock  balance={userStagedBalance} suffix={" YAI"}/>
            </div> 
            <div className="yai-card-content">
              <p>Bonded</p>
              <BalanceBlock  balance={userBondedBalance} suffix={" YAI"}/>
            </div>   
          </div>
          <div
            className="yai-card-button"
            onClick={()=>{setIsManageDAOModal(true)}}
          >
            Manage DAO
          </div>
          <div style={{marginBottom: '10px'}}>
            <h5 className="yai-card-subtitle">Coupons</h5>
            <div className="yai-card-content">
              <p>Purchased</p>
              <p>--</p>
            </div>
            <div className="yai-card-content">
              <p>Redeemable</p>
              <BalanceBlock  balance={redeemable} suffix={" YAI"}/>
              
            </div>    
          </div>
          <div
            className="yai-card-button"
            onClick={()=>{setIsManageCoupons(true)}}
          >
            Manage Coupons
          </div>
        
        </div>
      
      
      
        <div className="yai-card">
          <h3 className="yai-card-title">Liquidity</h3>
          <div style={{marginBottom: '10px'}}>
            <h5 className="yai-card-subtitle">LP</h5>
            <div className="yai-card-content">
              <p>Epoch Yield</p>
              <p>--%</p>
            </div>
            <div className="yai-card-content">
              <p>Cycle APY</p>
              <p>--%</p>
            </div>    
          </div>
          <div>
            <div className="yai-card-content">
              <p>Wallet (Trade YAI)</p>
              <p>--</p>
            </div>
            <div className="yai-card-content">
              <p>Staged</p>
              <BalanceBlock  balance={poolUserStagedBalance} suffix={" YAI"}/>
            </div> 
            <div className="yai-card-content">
              <p>Bonded</p>
              <BalanceBlock  balance={poolUserBondedBalance} suffix={" YAI"}/>
            </div>   
          </div>
          <div
            className="yai-card-button"
            onClick={()=>{setIsManageLPModal(true)}}
          >
            Manage LP
          </div>
          <div style={{marginBottom: '10px'}}>
            <h5 className="yai-card-subtitle">Coupons</h5>
            <div className="yai-card-content">
              <p>Earned</p>
              <BalanceBlock  balance={isRewardedNegative ? new BigNumber(0) : poolUserRewardedBalance} suffix={" YAI"}/>
            </div>
            <div className="yai-card-content">
              <p>Claimable</p>
              <BalanceBlock  balance={poolUserClaimableBalance} suffix={" YAI"}/>
              
            </div>    
          </div>
          <div
            className="yai-card-button"
            onClick={()=>{setIsManageRewardsModal(true)}}
            
          >
            Manage Rewards
          </div>
        </div>
      
      
      
      </StyledDashboardSection>
      {isManageDAOModal && user && <ManageDAOModel 
        user={user}
        balance={userESDBalance}
        allowance={userESDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        userStagedBalance={userStagedBalance}
        userBondedBalance ={userBondedBalance}
        setModal = {setIsManageDAOModal}
        approve={ApproveDAO}
        deposit={DepostYAIToDAO}
        withdraw={WithdrawYAIFromDAO}
        bond={BondYAITODAO}
        unbond={UnbondYAIFromDAO}
        />}
        {isManageLPModal && user && <ManageLPModal 
        user={user}
        balance={userESDBalance}
        allowance={userESDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        userStagedBalance={userStagedBalance}
        userBondedBalance ={userBondedBalance}
        setModal = {setIsManageLPModal}
        />}
        {isManageCoupons && user && <ManageCouponsModal 
        user={user}
        balance={userESDBalance}
        allowance={userESDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        userStagedBalance={userStagedBalance}
        userBondedBalance ={userBondedBalance}
        setModal = {setIsManageCoupons}
        />}

      {isManageCoupons && user && <ManageCouponsModal 
        user={user}
        balance={userESDBalance}
        allowance={userESDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
        userStagedBalance={userStagedBalance}
        userBondedBalance ={userBondedBalance}
        setModal = {setIsManageCoupons}
        />}

         {isManageRewardsModal && user && <ManageRewardsModal 
            user={user}
            balance={userESDBalance}
            allowance={userESDAllowance}
            stagedBalance={userStagedBalance}
            status={userStatus}
            userStagedBalance={userStagedBalance}
            userBondedBalance ={userBondedBalance}
            setModal = {setIsManageRewardsModal}
        />}

      
      {isManageDAOModal && !user && <PleaseConnectModal hasWeb3={hasWeb3} user={user} setUser={setUser}  setModal={setIsManageDAOModal}/>}
      {isManageLPModal && !user && <PleaseConnectModal hasWeb3={hasWeb3} user={user} setUser={setUser} setModal={setIsManageLPModal}/>}
      {isManageCoupons && !user && <PleaseConnectModal hasWeb3={hasWeb3} user={user} setUser={setUser}  setModal={setIsManageCoupons}/>}
      {isManageRewardsModal && !user && <PleaseConnectModal hasWeb3={hasWeb3} user={user} setUser={setUser}  setModal={setIsManageRewardsModal}/>}
      
      
      

    </>
  );
}

export default Dashboard;

let PleaseConnectModal = (props)=>{
    return(
      <StyledPleaseConnectModal>
        <div 
          className="close-icon"
          onClick={()=>{props.setModal(false)}}
          style={{cursor: 'pointer'}}
        >
          <i className=" fa fa-times fa-2x"></i>
        </div>
        <div>
          <i className="fa fa-warning fa-2x"></i>
          <h1>Please Connect your wallet</h1>
        </div>
        <div className='connect-wallet-button'>
          <ConnectWalletButton hasWeb3={props.hasWeb3} user={props.user} setUser={props.setUser} />
        </div>

      </StyledPleaseConnectModal>
    )

}

let StyledPleaseConnectModal = styled.div`
    width: 500px;
    height: 500px;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 30px;
    z-index: 50;
    border-radius: 20px;
    box-shadow: 0 0 50px rgba(0,0,0,0.3);
    @media only screen and (max-width: 550px){
      width: 300px!important;
      height: 50vh!important;
      h1{
        font-size: 18px!important;
        font-weight: bold;
      }

    }

    h1{
      font-size: 30px;
      font-weight: bold;

    }

    .close-icon{
      text-align: right;
      margin-left: auto;
    }
    .connect-wallet-button{
      margin-top: 50px;
      margin-left: auto;
      margin-right: auto;
    }

`

let StyledDashboardInfo = styled.section`
  display: flex;
  width: 100%;
  max-width: 1500px;
  justify-content: center;
  padding-top: 200px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  @media only screen and (max-width: 550px){
    padding-top: 80px;
  }
  color: white;
  /* background-color: #F40136; */
  .headerImage{
    /* position: absolute;
    left: 50%;
    top: 0; */
    /* transform: translateX(-50%); */
    z-index: 1;
    height: 500px;

  }
  .yai-dash-total-container{
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1500px;
    justify-content: center;
    flex-direction: column;
    z-index: 2;
    background-color: #F40136;
    font-family: 'Roboto', sans-serif;


  
    .yai-dash-total-title{
      font-size: 25px;
      font-weight: bold;
      text-align: center;
      font-family: 'Roboto', sans-serif;
      margin-top: 25px;
    }
    .yai-dash-total-value{
      font-size: 60px;
      text-align: center;
      font-weight: bold;
    }
  }
  .yai-dash-info-container{
    display: flex;
    justify-content: center;
    margin-bottom: 0px;
    background-color: #F40136;

    p{
      padding: 10px 30px;
      font-size: 25px;
      font-weight: bold;
      white-space: nowrap;
      font-family: 'Roboto', sans-serif;
    }
  }
  @media only screen and (max-width: 866px) {
    .yai-dash-info-container{
      flex-wrap: wrap;
      p{
        padding: 8px 20px;
        font-size: 18px;
      }
  }

  @media only screen and (max-width: 690px) {
    padding-top: 135px;
  }

  }

`

let StyledDashboardSection = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  height: fit-content;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  background-color: #F40136;
  font-family: 'Roboto', sans-serif;
  padding-bottom: 50px;
  padding-top: 35px;
  
  @media only screen and (max-width: 1190px) {
    flex-direction: column;
    align-items: center;
    .yai-card{
      :first-child{
        margin-right: 0px!important;
      }
      :last-child{
        margin-left: 0px!important;
      }
      margin-bottom: 50px;
    }

  }

  @media only screen and (max-width: 550px){
    .yai-card{
      width: 300px!important;
    }
    .yai-card-title{
      font-size: 25px!important;
    }
    .yai-card-subtitle{
      font-size: 18px!important;

    }
    .yai-card-content{
      font-size: 18px!important;
    }
    .yai-card-button{
      font-size: 25px!important;
    }
  }
  
  .yai-card{
    background-color: white;
    width: 500px;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
    border-radius: 20px;
    :first-child{
      margin-right: 50px;
    }
    :last-child{
      margin-left: 50px;
    }
    .yai-card-title{
      font-size: 32px;
      font-weight: 800;
      font-family: 'Roboto', sans-serif;
      margin-bottom: 40px;

    }
    .yai-card-subtitle{
      font-size: 28px;
      font-weight: bold;
      font-family: 'Roboto', sans-serif;

    }
    .yai-card-content{
      display: flex;
      font-size: 28px;
      margin: 0;
      justify-content: space-between;
    }
    .yai-card-button{
      width: 90%;
      padding: 10px;
      margin: 20px auto 20px auto;
      font-weight: bold;
      font-size: 32px;
      text-align: center;
      background: #CF0300;
      border-radius: 15px;
      color: white;
      cursor: pointer;
    }
  }


`