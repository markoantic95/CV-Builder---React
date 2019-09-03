import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import HomeGrid from "./HomeGrid";
import ButtonBases from "./ButtonBases";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withAlert } from 'react-alert';

// const styles = theme => ({
//     paper: {
//       padding: theme.spacing.unit * 2,
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
//   });

class Home extends Component {
    constructor(props){
        super(props);
        this.username = sessionStorage.getItem('user');
    }

    // componentDidMount(){
    //     this.props.alert.error(<div style={{ color: 'white' }}>Error! You cannot create new template!</div>);

    // }
    

    render() {
        
        return(
            <div>
                <MuiThemeProvider>
                <div>
                    <MenuAppBar
                        title="Home"
                        username={this.username}
                        history = {this.props.history}
                    />
                    <HomeGrid></HomeGrid>
                </div>
                </MuiThemeProvider>
          </div>
            
        )
        
    }
};
export default withAlert(Home);