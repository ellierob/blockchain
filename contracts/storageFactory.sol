// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//allows any version within 6
//pragma solidity ^0.6.0; 


//import
import "./store.sol";

// 'is' keyword allows inherit from other contract
contract storFact2 is stored {
    
}

contract storFact {

    stored[] public storedArray;

    function createStore() public {

        // initial 'stored' is keyword for declaring 
        // object 'stored2', of type 'stored' contract
        // 'new' keyword
        stored stored2 = new stored();
        storedArray.push(stored2);
    }

    function sfStore(uint256 _ind, uint256 _num) public {
        //gets address of deployed contract from pushed list
        stored stored3 = stored(address(storedArray[_ind]));

        stored3.store(_num);

        //ABI application binary interface
    }

    function sfGet(uint256 _ind) public view returns (uint256) {
        return stored(address(storedArray[_ind])).retrieve();
    }

}