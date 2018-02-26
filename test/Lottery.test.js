const assert = require('assert');
const ganache = require('ganache-cli'); //local test network
const Web3 = require('web3'); //capitalized as it is a constructor used to create instances

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile'); //properties exported as json in the compile.js

let accounts;
let lottery;

beforeEach(async () => {
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();
	//use one of those accounts to deploy the contract
	lottery = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode })
		.send({from: accounts[0], gas: 1000000});
	lottery.setProvider(provider);
});

describe('Lottery contract', () => {
	it('Deploy a contract', () => {
		//console.log(inbox);
		assert.ok(lottery.options.address); //if contract successfully deployed, its address will exist
	});

	it('Allows one account to enter the lottery', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});
	
	it('Allows multiple accounts to enter the lottery', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});
		
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3, players.length);
	});

	it('Requires a minimum amount to enter the lottery', async () => {		
		try {
			await lottery.methods.enter().send({
					from: accounts[0],
					value: web3.utils.toWei('0.0001', 'ether')
			});
			assert(false); //force the test to fail if the instruction above is validated with short amount of ether
		} catch (err) {
			assert(err);
		}		
	});	
	
	it('Only manager can call pickWinner', async () => {		
		try {
			await lottery.methods.pickWinner().send({
					from: accounts[1]
			});
			assert(false); //force the test to fail if the instruction above is validated with short amount of ether
		} catch (err) {
			assert(err);
		}		
	});	

	it('Sends money to the winner and reset players array', async () => {	
		//only enter one account so I know who is the winner
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});
		
		const initialBalance = await web3.eth.getBalance(accounts[0]); //will have deducted the value to enter the lottery
		
		await lottery.methods.pickWinner().send({
					from: accounts[0]
			});
		
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance; //thatś how much was spent on GAS
		assert(difference > web3.utils.toWei('1.8', 'ether')); //arbitrated value, as GAS would never be > 0.2 in this case
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});
		assert.equal(0, players.length); //assert that player array has been reset	

	});		
});