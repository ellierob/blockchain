// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//imports from @chainlink npm package, interface instead of contract
//interfaces complie down to ABI (application binary interface)
//allows to interact with listed funcions in another contract
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    mapping(address => uint256) public addrToAmo;
    address[] public funders;
    address public owner;


    constructor() public {
        //sets owner to whoever deploys the construct
        owner = msg.sender;
    }

    //'payable' keyword makes a function payable (red)
    function fund() public payable {

        //$5 seen raised to 10 ** 18
        //6000000 gwei
        uint256 minUSD = 5000000000000000000;
        
        //if statement can be replaced by shorter required statement
        //if(msg.value < minUSD){
        //    revert?
        //}

        // any transaction before 
        require(
            getRate(msg.value) >= minUSD,
            
            // message if requirement is not met
            "More ETH required"
            );

        addrToAmo[msg.sender] += msg.value;

        funders.push(msg.sender);

        // ETH -> USD
    }

    function getPrice() public view returns(uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        
        //commas without variable in tuple to ignore variables
        (,int256 answer,,,) = priceFeed.latestRoundData();
        
        return uint256(answer);
    }


    function getVer() public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getRate(uint256 _ethAmo) public view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethInUsd = (ethPrice * _ethAmo) /100000000;
        return ethInUsd;
    } 

    modifier onlyOwner {
        require(msg.sender == owner);
        //runs the modified function /code after the require statement
        _;
    }

    function wdraw() payable onlyOwner public {
        
        //keyword 'this' refers to contract
        //whose balance is transfered
        //to sender /caller
        payable(msg.sender).transfer(address(this).balance);

        for (uint256 funderInd=0; funderInd<funders.length; funderInd++){
            address funder = funders[funderInd];
            addrToAmo[funder] = 0;
        }
        funders = new address[](0);
    }
}