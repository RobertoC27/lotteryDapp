import React, { Component } from 'react';
import hdKey from 'ethereumjs-wallet/hdkey';
import bip39 from 'bip39';
import Faucet from '../faucet/Faucet';
import web3 from '../../utils/web3';
import './wallet.css';

class Wallet extends Component {
    state = {
        mnem: "",
        privateKey: "",
        publicKey: "",
        balance: '0',
        generated: false
    }

    generateAccount = () => {
        const mnem = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnem);
        const root = hdKey.fromMasterSeed(seed);
        const addrNode = root.deriveChild(0);
        this.setState({
            mnem,
            publicKey: addrNode.getWallet().getChecksumAddressString(),
            privateKey: addrNode.getWallet().getPrivateKeyString(),
            generated: true,
            balance: '0'
        })
    }

    checkFunds = async () => {
        const balance = await web3.eth.getBalance(this.state.publicKey);
        this.setState({balance: web3.utils.fromWei(balance, 'ether')});
		console.log(web3.utils.fromWei(balance, 'ether'));
	}

    render() {
        let faucet, walletBalance = null;
        if(this.state.mnem !== '') {
            faucet = <Faucet publicKey={this.state.publicKey} privateKey={this.state.privateKey}/>;
            walletBalance = (
                <div className="balance-container">
                    <div className="info-display available-funds">{this.state.balance} ether</div>
                    <div className="cta-button funds-button" onClick={this.checkFunds}>Check Funds</div>
                </div>
            );
        }
        
        return (
            <div>
                <div className="wallet-container">
                    <div className="wallet-row">
                        <div className="info-tag">Wallet address</div>
                        <div className="info-display pub-key">{this.state.publicKey}</div>
                    </div>
                    <div className="wallet-row">
                        <div className="info-tag">Private key</div>
                        <div className="info-display priv-key">{this.state.privateKey}</div>
                    </div>
                    <div className="wallet-row button-row">
                        <div className="cta-button generate-wallet" onClick={this.generateAccount}>
                            <a>Crear wallet</a>
                        </div>
                    </div>
                </div>
                {walletBalance}
                {faucet}
            </div>
        );
    }
}


export default Wallet;