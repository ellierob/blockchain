// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

// import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract safeMathTest {
    //in version below 8, checks big numbers from overflowing limit
    // using SafeMathChainlink for uint256;

    uint8 bigNum = 255;

    function increment() public {
        // "unchecked" keyword
        // allows incrementing
        // bignumbers past limit
        // is more gas efficient
        // if certain number won't get too big
        // or big number won't matter
        // unchecked {
        bigNum++;
        // }
    }
}
