// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";
import "./fundMe.sol";

contract bigNum {
    //in version below 8, checks big numbers from overflowing limit 
    using SafeMathChainlink for uint256;

    function getPrice() public view returns(uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        
        //commas without variable in tuple to ignore variables
        (,int256 answer,,,) = priceFeed.latestRoundData();
        
        return uint256(answer);
    }

    function getRate(uint256 _ethAmo) public view returns (uint256){
        uint256 ethPrice = getPrice();
        //both ethPrice and _ethAmo has 10^18 tacked on, so needds divide once more
        uint256 ethInUsd = (ethPrice * _ethAmo) /1000000000000000000;
        return ethInUsd;
    } 
}