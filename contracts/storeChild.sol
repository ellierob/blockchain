// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "./store.sol";

// 'is' keyword allows inherit from other contract
contract StorFactChild is Stored {

    // override keyword allows child contract function
    // to override parent contract function
    function store(uint256 _Num) public override {
        Num = _Num + 10;
    }
}