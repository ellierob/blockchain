// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//allows any version within 6
//pragma solidity ^0.6.0; 


//imports everything in ./store.sol
// including contract "stored"
import "./store.sol";

contract StorFact {

    // array of "stored" contracts
    Stored[] public storedArray;
    // address[] public storedArray;

    function createStore() public {

        // initial 'stored' is keyword for declaring 
        // object 'newStored', of type 'stored' contract
        // 'new' keyword
        // returns address of new created contract
        Stored newStored = new Stored();
        storedArray.push(newStored);
    }

    function sfStore(uint256 _ind, uint256 _num) public {
        //gets address of deployed contract from pushed list
        // Stored oldStored = Stored(address(storedArray[_ind]));
        // Stored oldStored = storedArray[_ind];
        // oldStored.store(_num);
        storedArray[_ind].store(_num);

        //ABI application binary interface
    }

    function sfGet(uint256 _ind) public view returns (uint256) {
        // return Stored(address(storedArray[_ind])).retrieve();
        return storedArray[_ind].retrieve();
    }

}