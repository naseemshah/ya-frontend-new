import React from 'react';

import BigNumber from 'bignumber.js';
import {formatBN} from "../../utils/number";

type BlanceBlockProps = {
  balance: BigNumber | string | number
  suffix?: string
}

function BalanceBlock({ balance, suffix=""}: BlanceBlockProps) {
  let integer = '0';
  let digits = '0';
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split('.')
    integer = tokens[0];
    digits = tokens[1];
  }

  return (
    <>
      <div>
        <span >{integer}</span>
        .
        <span >
          {digits}
        </span>
        {suffix === "" ? '' : <span>{suffix}</span> }
      </div>
    </>
  );
}

export default BalanceBlock;
