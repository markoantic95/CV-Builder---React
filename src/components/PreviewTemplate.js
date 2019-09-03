import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import axios from 'axios'
import MenuAppBar from "./MenuAppBar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class PreviewTemplate extends Component {
    constructor(props) {
        super(props);
        this.username = sessionStorage.getItem('user');
        this.state = {
            selectedSections: [],
            sectionsWithParamsArray: [],
            newCV:{}
        }
    }

    componentDidMount() {

        axios.get("http://localhost:8081/templateWithSections?tempID=" + sessionStorage.getItem('chosenTempIDView'))
            .then(res => {
                const tempSections = res.data;
                let array = [];
                for (var i = 0; i < tempSections.length; i++) {
                    array.push(tempSections[i].idSection);
                }
                this.setState({ titleT: sessionStorage.getItem('chosenTempNameView') });
                        this.setState({ selectedSections: array }, () => this.handlePDFText2());
                        this.setState({ loaded: 1 });

            })

    }

    handlePDFText2() {
        var pdfText = "";
        var sectionsWithParamsArray = [];
        if (this.state.selectedSections.length != 0) {
            const arr = [];
            for (var i = 0; i < this.state.selectedSections.length; i++) {
                const cryptoUrl = 'http://localhost:8081/ParamsForSectionID?sectionID=' + this.state.selectedSections[i].id;
                arr.push(axios.get(cryptoUrl));
            }
            Promise.all(arr).then((response) => {
                for (var i = 0; i < response.length; i++) {
                    let currentSection = this.state.selectedSections[i];
                    const params = response[i].data;
                    sectionsWithParamsArray.push({ sectionName: currentSection, params: params });
                    var textParams = "";
                    for (var j = 0; j < params.length; j++) {
                        textParams = textParams + " " + params[j].name;
                    }
                    <Text> </Text>
                    pdfText = pdfText + "   " + currentSection.name + ": " + textParams;
                    this.setState({ pdfText });
                    this.setState({ sectionsWithParamsArray });

                }
            }

            ).catch((err) => console.log(err));
        } else {
            this.setState({ sectionsWithParamsArray: [] });
        }
    }
    goToCreateCV(){
        sessionStorage.setItem('newCV',this.state.newCV.id);
        this.props.history.push({
            pathname: '/createACv'
        })
    }
    

    handleSelect() {
        var date = new Date();
        //prvo kreiraj novi cv
        var headers = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data = {
            
            "created": date,
            "createdUserId": {
                "id": sessionStorage.getItem('userID')
            },
            "templateCvId": {
               "id": sessionStorage.getItem('chosenTempIDView')
            }
        }
        axios.post('http://localhost:8081/createACV', data, headers)

            .then((res) => {
                const newCV = res.data;
                this.setState({ newCV },this.goToCreateCV);
                console.log(sessionStorage.getItem('newCV'));
                console.log("RESPONSE RECEIVED: ", res);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })
            //idi na stranicu za kreiranje cv-ja
        
    }
    handleBack() {
        
        this.props.history.push({
            pathname: '/listOfTemplatesForCV'
        })
    }
    render() {
        const styles = {
            div: {
                // display: 'flex',
                // flexDirection: 'row wrap',
                marginTop: 0,
                paddingLeft: "35%",
                width: '100%',
                height: '100vh',
                position: 'absolute',
                align: 'right'


            },
            divButton: {
                marginTop: 0,
                marginBottom: 10,
                align: 'left',
                position: 'left'
            }
        };

        const stylesPDF = StyleSheet.create({
            page: {
                paddingTop: 35,
                paddingBottom: 50,
                paddingHorizontal: 35,
                backgroundImage: 'url("images/backgroundPDF.jpg")'
            },
            section: {
                margin: 10,
                padding: 10,
                flexGrow: 1
            },
            title: {
                fontSize: 24,
                textAlign: 'center',
                fontFamily: 'Times-Roman'
            },
            header: {
                fontSize: 12,
                marginBottom: 10,
                marginTop: -5,
                marginLeft: -15,
                marginRight: -15,
                textAlign: 'center',
                color: 'grey',
            },
            subtitle: {
                fontSize: 14,
                margin: 10,
                // textDecoration: 'underline',
                textShadow: 4,
                fontWeight: 'bold',
                fontStyle: 'italic',
                backgroundColor: '#cccccc'
            },
            text: {
                margin: 10,
                fontSize: 12,
                textAlign: 'justify',
                fontFamily: 'Times-Roman',
                lineHeight: 0.6
            },
            pageNumber: {
                position: 'absolute',
                fontSize: 12,
                bottom: 30,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: 'grey',
            },
            viewParams: {
                lineHeight: '0,7'
            }

        });

        const MyDocument = () => (
            <Document key={this.state.key} title={this.state.titleT} width="50%" height="100vh"  >
                <Page wrap style={stylesPDF.page}>
                    {/* <View style={stylesPDF.section}> */}
                    {/* <Text style={stylesPDF.header} fixed>-Created by Marko Antic-</Text> */}
                    <Image style={stylesPDF.header} src='images/logo.jpg'></Image>
                    <Text style={stylesPDF.title}></Text>
                    {/* {this.state.sectionsWithParamsArray.map(val=>{
                        <Text style={stylesPDF.subtitle}>{val.sectionName.name}</Text>
                    })} */}

                    {this.state.sectionsWithParamsArray.length > 0 &&
                        <View>
                            {this.state.sectionsWithParamsArray.map((sect, i) =>
                                <View>
                                    <Text key={i} style={stylesPDF.subtitle}>{sect.sectionName.name}</Text>

                                    {this.state.sectionsWithParamsArray[i].params.map((par, j) =>
                                        <Text key={j} style={stylesPDF.text}>{par.name}:</Text>
                                    )}
                                </View>
                            )}

                        </View>

                    }
                    <Text style={stylesPDF.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    {/* <Image src='images/template.png'></Image> */}

                    {/* </View> */}
                    {/* <View style={stylesPDF.section}>
                        <Text>{this.state.section}</Text>
                    </View> */}
                </Page>
            </Document>
        );

        return (
            <div>
                <MuiThemeProvider>
                <div>
                    <MenuAppBar
                        title={"Preview: " + sessionStorage.getItem('chosenTempNameView')}
                        username={this.username}
                        history={this.props.history}
                    />
                    <br />
                    <div style={styles.div}>
                        <MyDocument />
                    </div>
                    <h2>Create your CV</h2>
                    <div style={styles.divButton}>
                        <RaisedButton label="Use this template" primary={true} onClick={(event) => this.handleSelect(event)} />
                    </div>
                    <div style={styles.divButton}>
                        <RaisedButton label="Choose another template" primary={true} onClick={(event) => this.handleBack(event)} />
                    </div>
                </div>
                </MuiThemeProvider>
            </div>

        )

    }
};

export default PreviewTemplate;