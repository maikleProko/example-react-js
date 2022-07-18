//import store from '../../store'
import "./UserSales.css";
import "w3-css/w3.css";

import React, {Component} from "react";
import {io} from "socket.io-client";

const socket = io();


class UserSales extends Component {
    constructor() {
        super();

        this.state = {
            name: sessionStorage.getItem('name'),
            sales: [],
            pullSeen: false,
            curAmount: undefined
        }

        this.getSales = this.getSales.bind(this);
        this.openPull = this.openPull.bind(this);
        this.closePull = this.closePull.bind(this);
        this.pull = this.pull.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
    }

    componentDidMount() {
        this.getSales();
    }

    getSales(){
        fetch('/sales/' + sessionStorage.getItem('name'))
            .then(response => response.json())
            .then(sales => {
                this.setState({sales: sales});
            });
    }

    handleAmountChange(event){
        this.setState({curAmount: event.target.value});
    }

    //Toggle buy
    openPull(){
        this.setState({
            pullSeen: true
        });
    }

    closePull(){
        this.setState({
            pullSeen: false
        });
    }

    pull(event){
        event.preventDefault();
        socket.emit("pull", {id: this.state.curPull.id, amount: parseInt(this.state.curAmount)});
    }
    renderPull(){
        if(this.state.pullSeen){
            return(
                <div id="buyDiv">
                    <form onSubmit={this.pull} className="w3-container">
                        <label>Amount:</label>
                        <input onChange={this.handleAmountChange}
                               type="number" min={1} max={this.state.curPull.amount} required
                               className="w3-input"/>
                        <button type="submit" className="w3-button w3-black">Pull</button>
                        <button onClick={this.closePull} className="w3-button w3-black">Close</button>
                    </form>
                </div>
            );
        }else{
            return null;
        }
    }
    renderUserSales() {
        return this.state.sales.map((sale, index) => {
            return (
                <tr key={index}>
                    <td>{sale.name}</td>
                    <td>{sale.amount}</td>
                    <td>{sale.price}</td>
                    <td style={{border: "none"}}><button onClick={()=>{this.openPull(); this.setState({curPull: sale})}}
                                                    className="w3-button w3-black">Pull</button></td>
                </tr>
            )
        });
    }

    render(){
        return (
            <div className="UserSales">

                <div id="userDiv">
                    <button className="w3-button w3-black" onClick={(event)=>{window.location = '/userPage'}}>User</button>
                    <br/>
                    {this.renderPull()}
                </div>

                <div id="tableDiv">
                    <p className="w3-container w3-black">Your Sales </p>
                    <table className="w3-table">
                        <thead className="w3-black">
                        <tr>
                            <th>Stock name</th>
                            <th>Amount</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderUserSales()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default UserSales;
