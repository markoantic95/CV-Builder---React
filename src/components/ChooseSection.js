import React, { Component } from "react";
import BlankPDF from '../static/assets/blank.pdf'
import pdfRacun from '../static/assets/Racun_APRIL_2018.pdf'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
class ChooseSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            templateTitle: ''
          }
    }
  
    
    
    handleTitle(newValue){
        this.props.sendData(this.state.templateTitle);
    }

    render() {
        return(
            <div>
               <h3>Enter template name</h3>
               <TextField
                        hintText="Enter template title"
                        floatingLabelText="Title"
                        //  value={this.state.username}
                        //  onChange={this.handleChange}
                        onChange = {(event,newValue) => this.setState({templateTitle:newValue},()=>this.handleTitle())}
                    />        
                <h3>Choose a section!</h3>
    
                <h3>Choose params for section!</h3>
                <RaisedButton label="Save changes" primary={true} onClick={(event) => this.handleRegister(event)}/>
            </div>
            
        )
        
    }
};


export default ChooseSection;