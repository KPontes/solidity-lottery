import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: '', 
      players: [], 
      balance: '',
      value: '',
      message: ''
    };

  }

  //didMount is a lifecycle method automatically called when the app component is placed on the screen
  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); //using metamask dont need to specify from:accounts[0]. it is default
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  // using this sintax avoids the need of using this and bind
  onSubmit = async event => {
    event.preventDefault(); //prevents submiting as normal http form

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting transaction processing...'});
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({message: 'You have been entered'});
  };

  onClick = async event => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting transaction processing...'});
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({message: 'A winner has been picked!'});
  };


  render() {
    //use promisse as can't use async await into react render
    //web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by: {this.state.manager}.
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} Ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4> Want to try your lucky?</h4>
          <div>
            <label>Amount of Ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
          <h4>Manager pick a winner?</h4>
          <button onClick={this.onClick} >Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
