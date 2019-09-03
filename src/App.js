import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import SearchTemplates from './components/SearchTemplates';
import CreateATemplate from './components/CreateATemplate';
import UpdateTemplate from './components/UpdateTemplate'
import PreviewTemplate from './components/PreviewTemplate'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ListOFTemplatesForCV from './components/ListOFTemplatesForCV';
import CreateACV from './components/CreateACV';
import SearchCVs from './components/SearchCVs';
import PreviewCV from './components/PreviewCV';

const options = {
  position: 'bottom center',
  timeout: 3000,
  offset: '30px'
}

class App extends Component {
  constructor(props){
    super(props);
}
static defaultProps = {
    user:{ }
}
  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      
        <AlertProvider template={AlertTemplate} {...options}>
                <Router>
                    <div>
                    {/* <MuiThemeProvider> */}
                        <Route exact path="/" component={Login}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/createATemplate" component={CreateATemplate}/>
                        <Route path="/searchTemplates" component={SearchTemplates}/>
                        <Route path="/updateTemplate" component={UpdateTemplate}/>
                        <Route path="/viewTemplate" component={PreviewTemplate}/>
                        <Route path="/listOfTemplatesForCV" component={ListOFTemplatesForCV}/>
                        <Route path="/createACv" component={CreateACV}/>
                        <Route path="/searchCVs" component={SearchCVs}/>
                        <Route path="/viewCV" component={PreviewCV}/>
                        {/* </MuiThemeProvider> */}
                    </div>
                </Router>
            </AlertProvider>
      // </div>
    );
  }
}

export default App;
