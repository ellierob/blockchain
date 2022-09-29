// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/vendor/SafeMathChainlink.sol";

contract bigNum {
    //in version below 8, checks big numbers from overflowing limit 
    using SafeMathChainlink for uint256;

    function getRate(uint256 _ethAmo) public view returns (uint256){
        uint256 ethPrice = getPrice();
        //both ethPrice and _ethAmo has 10^18 tacked on, so needds divide once more
        uint256 ethInUsd = (ethPrice * _ethAmo) /1000000000000000000;
        return ethInUsd;
    } 
}