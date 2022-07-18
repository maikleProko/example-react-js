//import store from '../../store'
import "./User.css";

import React, {Component} from "react";

import {io} from "socket.io-client";

const socket = io();

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: "",
                amount: 0,
                profit: 0,
                stocks: [],
                curProfit: 0
            },
            sales: [],
            curSale: undefined,
            curAmount: undefined,
            buySeen: false,
            active: false
        }

        this.getUser = this.getUser.bind(this);
        this.getSales = this.getSales.bind(this);
        this.closeBuy = this.closeBuy.bind(this);
        this.buy = this.buy.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.getSales();

        socket.emit("statusRequest");

        socket.on("status", (status)=>{
            this.setState({active: status});
        });

        /*
        socket.on("changeCurrent", (changeMsg) =>{
            if(changeMsg.name === sessionStorage.getItem('name')){
                this.setState({profit: this.state.profit + changeMsg.change});
            }
        });*/
    }

    getUser(){
        fetch('/users/' + sessionStorage.getItem('name'))
            .then(response => response.json())
            .then(user => {
                this.setState(
                    {user: user}
                );
            });
    }

    //Get all sales not by current user
    getSales(){
        fetch('/sales')
            .then(response => response.json())
            .then(sales => {
                this.setState(
                    {sales: sales.filter((sale) => sale.sellerName !== sessionStorage.getItem('name'))}
                );
            });
    }

    //Toggle buy
    openBuy(){
        this.setState({
            buySeen: true
        });
    }

    closeBuy(){
        this.setState({
            buySeen: false
        });
    }

    //Validation and update of state
    handleAmountChange(event){
        let inputAmount = event.target.value;
        if(inputAmount * this.state.curSale.price > this.state.user.amount){
            event.target.setCustomValidity("Not enough money");
        }else{
            event.target.setCustomValidity("");
            this.setState({curAmount: inputAmount});
        }
    }

    renderSales() {
        return this.state.sales.map((sale, index) => {
            return (
                <tr key={index}>
                    <td>{sale.name}</td>
                    <td>{sale.amount}</td>
                    <td>{sale.price}</td>
                    <td>{sale.sellerName}</td>
                    <td><button disabled={!this.state.active}
                                onClick={()=>{this.setState({curSale: sale}); this.openBuy();}}
                                className="w3-black w3-button">Buy</button></td>
                </tr>
            )
        });
    }

    buy(event){
        event.preventDefault();
        socket.emit("buy", {id: this.state.curSale.id, amount: parseInt(this.state.curAmount),
            name: sessionStorage.getItem('name')});
    }

    renderBuy(){
        if(this.state.buySeen){
            return(
                <div id="buyDiv">
                    <form className="w3-container" onSubmit={this.buy}>
                        <label>Amount:</label>
                        <input className="w3-input" onChange={this.handleAmountChange}
                            type="number" min={1} max={this.state.curSale.amount} required/>
                        <button className="w3-button w3-black" type="submit">Buy</button>
                        <button className="w3-button w3-black" onClick={this.closeBuy}>Close</button>
                    </form>
                </div>
            );
        }else{
            return null;
        }
    }

    render(){
        return (
            <div className="User">
                <div id="userDiv">
                    <table className="w3-table">
                        <tbody>
                            <tr>
                                <td className="w3-gray">Name:</td>
                                <td id="userName">{this.state.user.name}</td>
                            </tr>

                            <tr>
                                <td className="w3-gray">Amount:</td>
                                <td id="userAmount">{this.state.user.amount}</td>
                            </tr>

                            <tr>
                                <td className="w3-gray">Profit:</td>
                                <td id="userProfit">{this.state.user.profit}</td>
                            </tr>

                            <tr>
                                <td className="w3-gray">Current trade profit:</td>
                                <td id="curProfit">{this.state.user.curProfit}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="w3-button w3-black" onClick={(event)=>{
                        window.location = '/user/' + sessionStorage.getItem('name') + '/userSales'}
                    }>
                        Sales</button>
                    <button className="w3-button w3-black" onClick={(event)=>{
                        window.location = '/user/' + sessionStorage.getItem('name') + '/userStock'}
                    }>
                        Stock
                    </button>

                    {this.renderBuy()}
                </div>

                <div id="tableDiv">
                    <p className="w3-black">Sales</p>
                    <table className="w3-table">
                        <thead className="w3-black">
                        <tr>
                            <th>Stock name</th>
                            <th>Amount</th>
                            <th>Price</th>
                            <th>Seller</th>
                            <th>Buy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderSales()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default User;
