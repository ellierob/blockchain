// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//imports from @chainlink npm package, interface instead of contract
//interfaces complie down to ABI (application binary interface)
//allows to interact with listed funcions in another contract
// allows passing oracle contract address contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./priceConverter.sol";

contract FundMe {

    // makes 'PriceConverter' library functions methods of uint256
    using PriceConverter for uint256;

    address public owner;

    address[] public funders;

    AggregatorV3Interface private priceFeed;
    
    mapping(address => uint256) public funderToAmo;

    //$2 seen raised to 10 ** 18
    //6000000 gwei
    uint256 public constant minUSD = 2000000000000000000;

    // 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    // eth to usd pricefeed address from
    // https://docs.chain.link/data-feeds/price-feeds/addresses/#Goerli%20Testnet
    constructor(address _priceFeedAddress) {
        //sets owner to whoever deploys the construct
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    //'payable' keyword makes a function payable (red)
    function fund() public payable {

        
        //if statement can be replaced by shorter required statement
        //if(msg.value < minUSD){
        //    revert?
        //}

        // any transaction before 
        require(
            // valueInUSD(msg.value) >= minUSD,
            // first argument of library functions is same as caller
            msg.value.valueInUSD(priceFeed) >= minUSD,
            
            // message if requirement is not met
            "More ETH required"
            );

        funderToAmo[msg.sender] = msg.value;

        funders.push(msg.sender);

        // ETH -> USD
    }

    // like middleware
    // only owner
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            'You are not the owner'
            );
        //runs the modified function /code after the require statement
        _;
    }

    function wdraw() payable onlyOwner public {
        
        //keyword 'this' refers to contract
        //whose balance is transfered
        //to sender /caller

        // transfer automatically reverts if send fails
        // payable(msg.sender).transfer(address(this).balance);
        
        // call is powerful low lever function
        // allows sending token without gas
        // allows calling methods on contracts
        // but also can modify properties on addresses
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        
        // bool success = payable(msg.sender).send(address(this).balance);

        require(
            success,
            "Send failed"
        );
        

        for (uint256 funderInd=0; funderInd<funders.length; funderInd++){
            address funder = funders[funderInd];
            funderToAmo[funder] = 0;
        }

        // makes funders array blank
        funders = new address[](0);
    }

    function changeOwner(address _newOwner) onlyOwner public {
        owner = _newOwner;
    }
    

    // function getVer() public view returns (uint256){
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    //     return priceFeed.version();
    // }

    // function ethToUSD() public view returns(uint256) {
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        
    //     //commas without variable in tuple to ignore variables
    //     (,int256 answer,,,) = priceFeed.latestRoundData();
        
    //     return uint256(answer);
    // }

    // function valueInUSD(uint256 _ethAmo) public view returns (uint256){
    //     uint256 ethPrice = ethToUSD();
    //     uint256 ethInUsd = (ethPrice * _ethAmo) /100000000;
    //     return ethInUsd;
    // } 
}