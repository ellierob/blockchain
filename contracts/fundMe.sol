// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

//imports from @chainlink npm package, interface instead of contract
//interfaces complie down to ABI (application binary interface)
//allows to interact with listed funcions in another contract
// allows passing oracle contract address contract
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./priceConverter.sol";

// custom revert errors stored outside contracts
// takes less gas than require
error FundMe__NotOwner();

/* @title crowd funding
 * @author Farhan Absar
 * @notice fund me, good people
 * @dev does it work?
 */

contract FundMe {
   // @dev makes 'PriceConverter' library functions methods of uint256
   using PriceConverter for uint256;

   // variables that will be constant after once set
   // constants and immutables store directly in bytecode at deploy,
   // rather than storage slot
   // address public immutable owner prefixed with _i;
   // so to not store in storage
   address private i_owner;

   // storage variables prefixed with s_
   address[] private s_funders;

   AggregatorV3Interface private s_priceFeed;

   mapping(address => uint256) private s_funderToAmo;

   //$2 seen raised to 10 ** 18
   //6000000 gwei
   // setting constants take less less gas
   // constants are all-caps to not store in storage
   uint256 public constant MINUSD = 2000000000000000000;

   // like middleware
   // only owner
   modifier onlyOwner() {
      if (msg.sender != i_owner) {
         revert FundMe__NotOwner();
      }
      // custom error reverts stored outside contract
      // takes less gas than require
      // require(msg.sender == owner,'You are not the owner');

      //runs the modified function /code after the require statement
      _;
   }

   // 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
   // eth to usd pricefeed address from
   // https://docs.chain.link/data-feeds/price-feeds/addresses/#Goerli%20Testnet
   constructor(address _priceFeedAddress) {
      //sets owner to whoever deploys the construct
      i_owner = msg.sender;
      s_priceFeed = AggregatorV3Interface(_priceFeedAddress);
   }

   // special functions: "receive"
   // called when call data empty
   receive() external payable {
      fund();
   }

   // special functions: "fallback"
   // called when no defined receive function when call data empty
   // and when invalid call data method
   fallback() external payable {
      if (msg.value > 0) {
         fund();
      }
   }

   //'payable' keyword makes a function payable (red)
   function fund() public payable {
      //if statement can be replaced by shorter required statement
      //if(msg.value < MINUSD){
      //    revert?
      //}

      // any transaction before
      require(
         // valueInUSD(msg.value) >= MINUSD,
         // first argument of library functions is same as caller
         msg.value.valueInUSD(s_priceFeed) >= MINUSD,
         // message if requirement is not met
         "More ETH required"
      );

      s_funderToAmo[msg.sender] = msg.value;

      s_funders.push(msg.sender);

      // ETH -> USD
   }

   function wdraw() public onlyOwner {
      //keyword 'this' refers to contract
      //whose balance is transfered
      //to sender /caller

      // transfer automatically reverts if send fails
      // payable(msg.sender).transfer(address(this).balance);

      // call is powerful low lever function
      // allows sending token without gas
      // allows calling methods on contracts
      // but also can modify properties on addresses
      (bool success, ) = payable(msg.sender).call{value: address(this).balance}(
         ""
      );

      // bool success = payable(msg.sender).send(address(this).balance);

      require(success, "Send failed");

      // optimized memory variable
      address[] memory funders = s_funders;

      for (uint256 funderInd = 0; funderInd < funders.length; funderInd++) {
         address funder = funders[funderInd];
         s_funderToAmo[funder] = 0;
      }

      // makes funders array blank
      s_funders = new address[](0);
   }

   function getOwner() public view returns (address) {
      return i_owner;
   }

   function getFunders(uint256 idx) public view returns (address) {
      return s_funders[idx];
   }

   function getFunderToAmo(address _funder) public view returns (uint256) {
      return s_funderToAmo[_funder];
   }

   function getPriceFeed() public view returns (AggregatorV3Interface) {
      return s_priceFeed;
   }

   function changeOwner(address _newOwner) public onlyOwner {
      i_owner = _newOwner;
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
