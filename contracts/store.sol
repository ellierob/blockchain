// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//allows any version within 6
//pragma solidity ^0.6.0; 

//contract is like a class in javascript
contract Stored {
    
    // initializes favNum to 0
    // contract state variables are stored at indexes
    // keyword "public" creates a getter function for the state variable
    // unless storage is defined, variables are cached in storage
    uint256 public Num;

    //struct like class /datatype in javascript
    struct People {
        uint256 num;
        // strings are initialized to ''
        string name;
    }

    People public person = People({num:2, name:"patrick"});

    //array of People
    // 3 indicates maximum number in array
    People[] public pueblo;

    // mapping creates dictionary to get num from name
    mapping(string =>  uint256) public nameToNum;

    // structs, arrays (strings) and mappings require storage indication
    // when stored in memory only stored during execution 
    // when stored in storage, it persists after execution
    // string in solidity is an array object
    function addpers(string memory _name, uint256 _num) public {
        // if (pueblo.length < 3) {
            pueblo.push(People({num: _num, name: _name}));
            nameToNum[_name] = _num;
        // }
    }

    // without any keyword state variables are set to "internal"
    uint256 favNum = 5;
    bool favBool = true;
    string favString = "string";
    int favInt = -5;
    //address favAdr = 0x456;
    bytes32 favByt = "cat";

    // virtual keyword makes the function overrideable by child contracts
    function store(uint256 _Num) public virtual {
        Num = _Num;
    }

    // pure functions neither modify nor access blockchain state variables
    // view & pure notated functions don't spend gas, make transactions or return hash
    // but view & pure can have execution cost
    function store2(uint256 _Num) private pure {
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