import React, {Component} from 'react';
import web3 from '../../utils/web3';
import Prizes from '../prizes/Prizes';
import './lottery.css';

class Lottery extends Component {
	
	state = {
		players: 0,
		prize: '0'
	}
	
	// lotteryAddress = '0xcd5101147599c21005fc88b6e8c9ecf98a1d278b';
	// lotteryAddress = '0xbdeed068723aa6cf5f24db501f344ea55671465b';
	lotteryAddress = '0xe77dd7225e898ac3313b571729d4facf9b7ead9a';

	componentDidMount() {
		this.obtainInfo()
	}

	obtainInfo = async () => {
		let contract = await new web3.eth.Contract(ABI, this.lotteryAddress);
		let players = await contract.methods.totalParticipants().call({from: this.props.publicKey});
		let prize = await contract.methods.prize().call({from:this.props.publicKey});
		this.setState({players, prize: web3.utils.fromWei(prize, 'ether')})
	}

	enterLottery = async () => {
		let contract = await new web3.eth.Contract(ABI, this.lotteryAddress);
		let encoded = contract.methods.enterLottery().encodeABI();
		console.log(encoded);

		web3.eth.accounts.signTransaction({
			from: this.props.publicKey,
			to: this.lotteryAddress,
			// to: '0x09c4af31fb28788aedae0626f853f1727548aebc',
			value: web3.utils.toWei('0.5', 'ether'),
			data: encoded,
			gas: 62108
		}, this.props.privateKey).then(signed => {
			web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
			console.log('enviada la transaccion');

		});
	}

	render() {	
		return (
			<div>
			<div className="lottery-container">
				<div className="lottery-btn">
					<div onClick={this.enterLottery}>Enter lottery</div>
				</div>
			</div>
			<div onClick={this.obtainInfo} className="prize-info-btn">Obtain prize info</div>
			<Prizes players={this.state.players} prize={this.state.prize}/>
			</div>
		);
	}
}

const ABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "enterLottery",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "resetLottery",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "WinnerPicked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "total",
				"type": "uint256"
			}
		],
		"name": "newParticipant",
		"type": "event"
	},
	{
		"inputs": [
			{
				"name": "_minAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "creator",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "prize",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalParticipants",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export default Lottery;