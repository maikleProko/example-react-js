//import store from '../../store'
import "./UserStock.css";

import React, {Component} from "react";
import {io} from "socket.io-client";

const socket = io();


class UserStock extends Component {
    constructor() {
        super();

        this.state = {
            name: sessionStorage.getItem('name'),
            stocks: [],
            sellSeen: false,
            curSale: undefined
        }

        this.getStock = this.getStock.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.sell = this.sell.bind(this);
        this.closeSell = this.closeSell.bind(this);
        this.sell = this.sell.bind(this);
    }

    componentDidMount() {
        this.getStock();
    }

    getStock(){
        fetch('/users/' + sessionStorage.getItem('name'))
            .then(response => response.json())
            .then(user => {
                this.setState({stocks: user.stocks});
            });
    }

    openSell(){
        this.setState({
            sellSeen: true
        });
    }

    closeSell(){
        this.setState({
            sellSeen: false
        })
    }

    sell(event){
        event.preventDefault();

        socket.emit("sell", {
            name: this.state.curSale.name,
            amount: parseInt(this.state.curAmount),
            price: parseInt(this.state.curPrice),
            sellerName: this.state.name
        })
    }

    //Update of state
    handleAmountChange(event){
        this.setState({curAmount: event.target.value});
    }

    handlePriceChange(event){
        this.setState({curPrice: event.target.value});
    }

    renderUserStock(){
        return this.state.stocks.map((stock, index) => {
            return (
                <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.amount}</td>
                    <td style={{border: "none"}}><button className="w3-button w3-black" onClick={()=>{this.openSell(); this.setState({curSale: stock})}}>Sell</button></td>
                </tr>
            )
        });
    }

    renderSell(){
        if(this.state.sellSeen){
            return(
                <div id="sellDiv" className="w3-container">
                    <form onSubmit={this.sell}>
                        <label>Amount:</label>
                        <input onChange={this.handleAmountChange}
                               type="number" min={1} max={this.state.curSale.amount} required
                               className="w3-input"/>

                        <label>Price:</label>
                        <input onChange={this.handlePriceChange}
                               type="number" min={0} required
                               className="w3-input"/>

                        <button className="w3-button w3-black" type="submit">Sell</button>
                        <button className="w3-button w3-black" onClick={this.closeSell}>Close</button>
                    </form>
                </div>
            );
        }else{
            return null;
        }
    }


    render(){
        return (
            <div className="UserStock">

                <div id="userDiv">
                    <button className="w3-button w3-black" onClick={(event)=>{window.location = '/userPage'}}>User</button>
                    <br/>
                    {this.renderSell()}
                </div>

                <div id="tableDiv">
                    <p className="w3-black w3-container">Your Stock</p>
                    <table className="w3-table">
                        <thead className="w3-black">
                        <tr>
                            <th>Stock name</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderUserStock()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default UserStock;
