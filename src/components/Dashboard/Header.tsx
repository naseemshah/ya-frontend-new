import React from 'react';
import BigNumber from 'bignumber.js';

import BalanceBlock from './BalanceBlock';
import {ownership} from "../../utils/number";

type AccountPageHeaderProps = {
  accountESDBalance: BigNumber,
  accountESDSBalance: BigNumber,
  totalESDSSupply: BigNumber,
  accountStagedBalance: BigNumber,
  accountBondedBalance: BigNumber,
  accountStatus: number,
  unlocked: number,
};

const STATUS_MAP = ["Unlocked", "Locked", "Locked"];



const AccountPageHeader = ({
  accountESDBalance, accountESDSBalance, totalESDSSupply, accountStagedBalance, accountBondedBalance, accountStatus, unlocked
}: AccountPageHeaderProps) => (
  <div >
    <div>
      <BalanceBlock  balance={accountESDBalance} suffix={" YAI"}/>
    </div>
    
    <div>
      <BalanceBlock  balance={ownership(accountESDSBalance, totalESDSSupply)}  suffix={"%"}/>
    </div>
    
    <div>
      <BalanceBlock balance={accountStagedBalance}  suffix={" YAI"}/>
    </div>
    <div>
      <BalanceBlock balance={accountBondedBalance} suffix={" YAI"} />
    </div>
  </div>
);


export default AccountPageHeader;
