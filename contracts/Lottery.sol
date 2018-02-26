pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        //current block difficulty + current time + addresses of players
        //into the hash sha3 or keccak256
        return uint(keccak256(block.difficulty, now, players)); 
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        //players has some methods associated as it is from type address
        //transfer the total balance from this contract to the winner
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }


}