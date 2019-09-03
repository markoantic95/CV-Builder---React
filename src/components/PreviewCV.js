import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import axios from 'axios'
import MenuAppBar from "./MenuAppBar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (JSON.stringify(array[i][attr]) === JSON.stringify(value)) {
            return i;
        }
    }
    return -1;
}
class PreviewCV extends Component {
    constructor(props) {
        super(props);
        this.username = sessionStorage.getItem('user');
        this.state = {
            selectedSections: [],
            sectionsWithParamsArray: [],
            newCV: {},
            paramsOnly: [],
            cvDetails: []

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
                axios.get("http://localhost:8081/returnCvDetails?cvID=" + sessionStorage.getItem('chosenCVIDView'))
                    .then(res => {
                        const cvDetails = res.data;
                        let paramsOnly=[];
                        for (var i = 0; i < cvDetails.length; i++) {
                            paramsOnly.push(cvDetails[i].templateParamId);
                        }
                        this.setState({ cvDetails });
                        this.setState({paramsOnly});
                        this.setState({ selectedSections: array }, () => this.handlePDFText2());
                    })


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

    returnNotNullValue(par) {
        switch (par.classType) {
            case 'java.lang.String':
                return this.state.cvDetails[findWithAttr(this.state.cvDetails, 'templateParamId', par)].stringValue;
            case 'java.util.Date':
                return this.state.cvDetails[findWithAttr(this.state.cvDetails, 'templateParamId', par)].dateValue;
            case 'java.lang.Integer':
                return this.state.cvDetails[findWithAttr(this.state.cvDetails, 'templateParamId', par)].intValue;
        }
    }

    ifItContains(){
        if(this.state.sectionsWithParamsArray.length > 0){
            for (var i = 0; i < this.state.sectionsWithParamsArray.length; i++) {
                for (var j = 0; j < this.state.sectionsWithParamsArray[i].params.length; j++){
                    if(this.state.paramsOnly[findWithAttr(this.state.paramsOnly,'id',this.state.sectionsWithParamsArray[i].params[j].id)]){
                        return true;
                    }
                }

            }
        }
    }



    handleBack() {

        this.props.history.push({
            pathname: '/listOfTemplatesForCV'
        })
    }
    render() {
        for (var j = 0; j < this.state.paramsOnly.length; j++) {
            console.log(this.state.paramsOnly[j].name);
        }

        
        const styles = {
            div: {
                // display: 'flex',
                // flexDirection: 'row wrap',
                marginTop: 0,
                paddingLeft: "25%",
                width: '50%',
                height: '100vh',
                position: 'absolute',
                align: 'center'


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
            <Document key={this.state.key} title={this.state.titleT} width="90%" height="520px" style={{ position: 'left' }} >
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
                                    {/* this.state.paramsOnly[findWithAttr(this.state.paramsOnly,'id',this.state.sectionsWithParamsArray[i].params[j].id)]){ */}
                                    {this.state.sectionsWithParamsArray[i].params.map((par, j) =>
                                        this.state.cvDetails.length!=0 && this.state.paramsOnly[findWithAttr(this.state.paramsOnly,'id',par.id)] &&
                                        <Text key={j} style={stylesPDF.text}>{par.name}:{this.returnNotNullValue(par)} </Text>

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
                            title={"CV preview"}
                            username={this.username}
                            history={this.props.history}
                        />
                        <br />
                        <div style={styles.div}>
                            <MyDocument />
                        </div>

                    </div>
                </MuiThemeProvider>
            </div>

        )

    }
};

export default PreviewCV;