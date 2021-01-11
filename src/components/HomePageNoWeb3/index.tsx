import React from 'react';
import {
  Box, LinkBase, Tag,
} from '@aragon/ui';
import styled from 'styled-components'

function HomePageNoWeb3() {

  return (
    <>

      <StyledMessageBoxWrapper>
        <div className="messageBox">
          <div><i className="fa fa-times fa-2x"></i></div>
          <h1>No web3 wallet detected</h1>
          <h5><a href="https://www.metamask.io/">Click to get Metamask.</a></h5>
        </div>
        
      </StyledMessageBoxWrapper>
    </>
  );
}




export default HomePageNoWeb3;

let StyledMessageBoxWrapper = styled.div`
  background-color: #F40136;
  width: 100%;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  max-height: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .messageBox{
    background-color: white;
    border-radius: 10px;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    padding: 30px;
  }
  

`