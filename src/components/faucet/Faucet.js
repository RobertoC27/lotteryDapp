import React from 'react';
import Lottery from '../lottery/Lottery';
import web3 from '../../utils/web3';
import './faucet.css';

const Faucet = (props) => {
    let accounts, available, contract;
    
    const checkFaucet = async () => {
        accounts = await web3.eth.getAccounts();
        // contract = await new web3.eth.Contract(ABI, "0x7ae7f632eef24cc162d4a1a98b39aad9a0ab1ddf");
	contract = await new web3.eth.Contract(ABI, "0xd6bc75fddd2bfa791ec9022145ab90320c8f3c19");
        available = await contract.methods.available().call({from: props.publicKey});
        if(available) {
            fundAccount(contract)
        }
    }

    const fundAccount = async (contract) => {
        const alreadyFunded = await contract.methods.checkAccount(props.publicKey).call({from: props.publicKey});
        if(!alreadyFunded) {
            await contract.methods.fundAccount(props.publicKey).send({from: accounts[0]});
        }
    }

    return (
        <div>
            <div className="faucet-container">
                <div onClick={checkFaucet} className="faucet-btn">
                    <a>Recibir Ether</a>
                </div>
            </div>
            <Lottery publicKey={props.publicKey} privateKey={props.privateKey}/>
        </div>
    )

}

const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_reciever",
				"type": "address"
			}
		],
		"name": "fundAccount",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_funded",
				"type": "address"
			}
		],
		"name": "newFunds",
		"type": "event"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "updateAvailable",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "available",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_toBeChecked",
				"type": "address"
			}
		],
		"name": "checkAccount",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
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
		"name": "owner2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export default Faucet;
