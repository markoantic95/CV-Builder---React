import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuAppBar from './MenuAppBar'; 
import Recaptcha from 'react-recaptcha';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withAlert } from 'react-alert';
import { register } from '../components/util/APIUtils';

class Register extends Component {
    
  constructor(props){
    super(props);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
   
    this.state={
      username:'',
      password:'',
      newUser:{},
      isVerified: false
    }
  }

  verifyCallback(response) {
    if (response) {
        this.setState({
            isVerified: true
        })
    }
  }

  recaptchaLoaded() {
    console.log('capcha successfully loaded');
  }

  handleRegister(){
    // 
    if (this.state.isVerified) {
      this.Register();
      
    }
    else {
      alert('Čekirajte polje kako biste potvrdili da niste robot!');
    }
  }

  Register(){
    var headers = {
      'headers': {
          'Content-Type': 'application/json;charset=UTF-8'
      }
  }
  var registerRequest = {
    "username": this.state.username,
    "password": this.state.password
  }

  register(registerRequest)
            .then(response => {
              const newUser = response;
              this.props.alert.success(<div style={{ color: 'white' }}>Registration completed successfully!</div>);
              this.setState({newUser}, this.goToHomePage);
            }).catch(error => {
              if(error.status ===400){
                this.props.alert.error(<div style={{ color: 'white' }}>{error.message}</div>);
              } 
              else this.props.alert.error(<div style={{ color: 'white' }}>Your registration attempt was unsuccessful!</div>);
            });
  }

  goToHomePage(){
    sessionStorage.setItem('user', this.state.newUser.username);
    sessionStorage.setItem('userID', this.state.newUser.id);
    this.props.history.push({
        pathname: '/home'
    })
}

BackToLogin(){
  this.props.history.push({
      pathname: '/'
  })
}

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <MenuAppBar
             title="Register"
             auth={false}
           />
           <Grid>
             <Paper style={{textAlign:'center', width: '40%', marginLeft: '30%', marginTop: '2%'}} >
           <Grid container
                    direction="column" justify="center"
                    alignItems="center">
              
                  <TextField
                    hintText="Enter your Username"
                    //  type="email"
                    floatingLabelText="Username"
                    onChange = {(event,newValue) => this.setState({username:newValue})}
                    />
                  <br/>
                  <TextField
                    type = "password"
                    hintText="Enter your Password"
                    floatingLabelText="Password"
                    onChange = {(event,newValue) => this.setState({password:newValue})}
                    />
                  <br/>
                 
              
            </Grid>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                        <Recaptcha className="recaptcha"
                                sitekey="6LedlWkUAAAAALcrm3z_0MntxQ26RMh8SMx0OtZl"
                                render="explicit"
                                onloadCallback={this.recaptchaLoaded}
                                verifyCallback={this.verifyCallback}
                                badge= 'center'
                                justify='center'
                                
                        />
                        <br/>
                        <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleRegister(event)}/>
                  </Grid>
                   </Paper>
                  </Grid>
                  <Grid container
                    direction="column" justify="center" alignItems="center"
                    >
                    <hr></hr>
                    {"Already have an account? Sign in"}
                    <RaisedButton label="Sign in" primary={true} style={style} onClick={(event) => this.BackToLogin(event)}/>
                  </Grid>
                  <br/>
        </div>
      </MuiThemeProvider>
    </div>
    );
  }
}
const style = {
  margin: 15,
};
export default withAlert(Register);