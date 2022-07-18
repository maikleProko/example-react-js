import store from '../../store'

import 'w3-css/w3.css';
import "./Login.css";
import {Component} from "react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    validateForm() {
        return this.state.name.length > 0
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/users')
            .then(response => response.json())
            .then(users => {
                let user = users.find((elem) => elem.name === this.state.name);
                if(user){
                    store.dispatch({ type: 'login', payload: this.state.name });
                    sessionStorage.setItem("name", this.state.name);

                    if(user.isAdmin){
                        window.location = '/adminPage';
                    }else{
                        window.location = '/userPage';
                    }

                }else{
                    alert("No such user");
                }
            });
    }

    render(){
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit} className="w3-container">
                    <label>Name</label>
                    <input className="w3-input" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
                    <button className="w3-button w3-black" type="submit" disabled={!this.validateForm()}>
                        Login
                    </button>
                </form>
            </div>
        );
    }
}

export default Login;
