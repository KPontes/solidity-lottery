const path = require('path');
const fs = require('fs');
const solc = require('solc');

//using this function ensures cross OS compatibility for the path
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); 
const source = fs.readFileSync(lotteryPath, 'utf8');

//console.log(solc.compile(source, 1)); //source * the number of contracts being compiled

module.exports = solc.compile(source, 1).contracts[':Lottery'];

