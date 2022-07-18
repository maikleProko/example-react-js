//import store from '../../store'
import "./Admin.css";
import 'w3-css/w3.css';

import React, {Component} from "react";
import {io} from "socket.io-client";

const socket = io();

class Admin extends Component {
    constructor() {
        super();

        this.state = {
            users: [],
            sales: [],
            distribution: undefined,
            status: undefined
        }


        this.startTrade = this.startTrade.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getSales = this.getSales.bind(this);
    }


    componentDidMount(){
        this.getUsers();
        this.getSales();

        socket.emit('statusRequest');

        socket.on('status', (status)=>{
            this.setState({status: status});

            console.log(this.state);
        });
    }

    getUsers(){
        fetch('/users')
            .then(response => response.json())
            .then(allUsers => {
                this.setState({users: allUsers.filter((user) => !user.isAdmin)});
            });
    }

    getSales(){
        fetch('/sales')
            .then(response => response.json())
            .then(saleArray =>{
                this.setState({sales: saleArray});
            });
    }

    renderTableData() {
        return this.state.users.map((user, index) => {
            let stockAmount = 0;
            for (let stock of user.stocks) {
                stockAmount += stock.amount
            }

            let sellingAmount = 0;
            for (let sale of this.state.sales) {
                if (user.name === sale.sellerName) {
                    sellingAmount += sale.amount;
                }
            }

            return (
                <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.amount}</td>
                    <td>{stockAmount}</td>
                    <td>{sellingAmount}</td>
                </tr>
            )
        });
    }

    startTrade(event){
        event.preventDefault();
        socket.emit("startTrade", this.state.distribution);
    }

    stopTrade(event){
        event.preventDefault();
        socket.emit("stopTrade");
    }

    render(){
        return (
            <div>
                <p className="w3-container w3-black">Welcome admin</p>
                <div id="mainDiv">

                    <div id="adminControls">
                        <form onSubmit={this.startTrade}>
                            <select className="w3-select" required onChange={(e) => this.setState({distribution: e.target.value})}>
                                <option/>
                                <option value='continuous'>Continuous</option>
                                <option value='normal'>Normal</option>

                            </select>
                            <button type="submit" disabled={this.state.status} className='w3-button w3-black'>Start trade</button>
                        </form>
                        <br/>
                        <button onClick={this.stopTrade} disabled={!this.state.status} className='w3-button w3-black'>Stop trade</button>
                    </div>

                    <div id="usersTableDiv">
                        <table id='usersTable' className="w3-table">
                            <thead className="w3-black">
                            <tr>
                                <th>Name</th>
                                <th>Money</th>
                                <th>Stock amount</th>
                                <th>Selling amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;
