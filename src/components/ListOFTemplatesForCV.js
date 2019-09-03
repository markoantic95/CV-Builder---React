import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import HomeGrid from "./HomeGrid";
import ButtonBases from "./ButtonBases";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List  from "./List";
import axios from 'axios';

// const styles = theme => ({
//     paper: {
//       padding: theme.spacing.unit * 2,
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
//   });

class ListOFTemplatesForCV extends Component {
    constructor(props){
        super(props);
        this.username = sessionStorage.getItem('user');
        this.state = {
            userTemplates:[],
            loaded:0
        }
    }

    componentDidMount(){
        axios.get("http://localhost:8081/templatesForUser?userID="+sessionStorage.getItem('userID'))
            .then(res => {
                const userTemplates = res.data;
                this.setState({ userTemplates });
                this.setState({loaded:1});
            })
    }
    

    render() {
        console.log("BBB"+this.state.userTemplates[0]);
        if(this.state.loaded===1){
        return(
            <div>
                <MuiThemeProvider>
                <div>
                    <MenuAppBar
                        title="Choose a CV Template"
                        username={this.username}
                        history = {this.props.history}
                    />
                    <br/>
                    <List history = {this.props.history} listForTable={this.state.userTemplates} showAllButtons={false} type="template"></List>
                </div>
                </MuiThemeProvider>
          </div>
            
        )
        
    }

    else{
        return(
            <h1>Loading....</h1>
        )
       }
    }
    
};
export default ListOFTemplatesForCV;