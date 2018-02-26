const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
	'describe diamond reflect pulp practice spoon tide draw draft hello develop body',
	'https://rinkeby.infura.io/JCk41EvcUW5XJTBeriv4'
);

const web3 = new Web3(provider);
//just use a function in order to be able to use async await
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();

//deployed at address: 0x067366C848aEcde63d124624DcCb211FFAa083Bd