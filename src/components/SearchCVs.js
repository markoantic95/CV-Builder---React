import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import HomeGrid from "./HomeGrid";
import ButtonBases from "./ButtonBases";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List  from "./List";
import axios from 'axios';



class SearchCVs extends Component {
    constructor(props){
        super(props);
        this.username = sessionStorage.getItem('user');
        this.state = {
            userCVs:[],
            loaded:0
        }
    }

    componentDidMount(){
        axios.get("http://localhost:8081/cvsForUser?userID="+sessionStorage.getItem('userID'))
            .then(res => {
                const userCVs = res.data;
                this.setState({ userCVs });
                this.setState({loaded:1});
            })
    }
    

    render() {
        if(this.state.loaded===1){
        return(
            <div>
                <MuiThemeProvider>
                <div>
                    <MenuAppBar
                        title="Search Your CVs"
                        username={this.username}
                        history = {this.props.history}
                    />
                    <br/>
                    <List history = {this.props.history} listForTable={this.state.userCVs} showAllButtons={false} type="cv"></List>
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
export default SearchCVs;