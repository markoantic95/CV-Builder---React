import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withAlert } from 'react-alert';
import { login } from '../components/util/APIUtils';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            activeUser: {}
        }
    }

    handleRegister() {
        this.props.history.push({
            pathname: '/register',
        })
    }

    goToHomePage() {
        sessionStorage.setItem('user', this.state.activeUser.username);
        sessionStorage.setItem('userID', this.state.activeUser.id);

        this.props.history.push({
            pathname: '/home'
        })
    }

    handleLogin() {
        var headers = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var loginRequest = {
            "username": this.state.username,
            "password": this.state.password
        }
        login(loginRequest)
            .then(response => {
                const activeUser = response;
                this.props.alert.success(<div style={{ color: 'white' }}>Welcome! You have successfully logged in!</div>);
                this.setState({ activeUser }, this.goToHomePage);
            }).catch(error => {
                if(error.status ===404){
                    this.props.alert.error(<div style={{ color: 'white' }}>{error.message}</div>);
                } 
                else {
                    this.props.alert.error(<div style={{ color: 'white' }}>Sorry! Something went wrong. Please try again!</div>);
                }
            });
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <MenuAppBar
                            title="Login"
                            auth={false}
                        />
                        <Grid container
                            direction="column" justify="center"
                        >
                            <Paper style={{ textAlign: 'center', width: '40%', marginLeft: '30%', marginTop: '2%' }} >
                                <TextField
                                    hintText="Enter your Username"
                                    floatingLabelText="Username"
                                    onChange={(event, newValue) => this.setState({ username: newValue })}
                                />
                                <br />
                                <TextField

                                    type="password"
                                    hintText="Enter your Password"
                                    floatingLabelText="Password"
                                    onChange={(event, newValue) => this.setState({ password: newValue })}
                                />
                                <br />
                                <RaisedButton label="Sign in" primary={true} style={style} onClick={(event) => this.handleLogin(event)} />
                            </Paper>
                            <br />

                            <br />
                        </Grid>
                        <Grid container
                            direction="column" justify="center" alignItems="center"
                        >
                            {"Not registered yet, Register Now"}
                            <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleRegister(event)} />
                        </Grid>


                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
const style = {
    margin: 15,
};
export default withAlert(Login);