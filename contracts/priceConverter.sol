// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// ABI interface of the oracle contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// libraries are unpayable contracts without state variables
// they can be turned into methods for objects, classes, datatypes
library PriceConverter {
  // uses chainlink oracle contract aggregator
  // takes address of contract as argument
  function ethToUSD(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    // returns in eth rate * 10^8
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    
    // typecast int to uint
    // ETH/USD 10^8, 
    // into 10^10 to get 18 digits gwei
    return uint256(answer * 10000000000);
  }

  // 1000000000
  // call it get fiatConversionRate, since it assumes something about decimals
  // It wouldn't work for every aggregator
  // first argument of library function is same as caller
  function valueInUSD(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = ethToUSD(priceFeed);
    
    // divide by 10^18 to get usd
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
    // the actual ETH/USD conversation rate, after adjusting the extra 0s.
    return ethAmountInUsd;
  }
}