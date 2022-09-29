// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//allows any version within 6
//pragma solidity ^0.6.0; 

//contract is like a class in javascript
contract stored {
    
    //initializes favNum to 0
    uint256 public Num;

//struct like object or construct in javascript
    struct people {
        uint256 num;
        string name;
    }

    people public person = people({num:2, name:"patrick"});

    //array
    people[] public pueblo;

    mapping(string =>  uint256) public nameToNum;

    // when stored in memory only stored during execution 
    // when stored in storage, it persists after execution
    // string in solidity is an array object
    function addpers(string memory _name, uint256 _num) public {
        pueblo.push(people({num: _num, name: _name}));
        nameToNum[_name] = _num;
    }

    uint256 favNum = 5;
    bool favBool = true;
    string favString = "string";
    int favInt = -5;
    //address favAdr = 0x456;
    bytes32 favByt = "cat";

    function store(uint256 _Num) public {
        Num = _Num;
    }

    function store2(uint256 _Num) private {
        uint256 Num2;
        Num2 = _Num;
    }

    //view keyword allows blockchain function without transaction /gas
 
    function retrieve() public view returns(uint256) {
        return Num;
    }
    
    //pure is also similar keyword
    function math(uint256 _Num) public pure returns(uint256) {
        return _Num*2;
    }
}