import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font,PDFViewer } from '@react-pdf/renderer';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
const styles = {
    div: {
        display: 'flex',
        flexDirection: 'row wrap',
        padding: 20,
        width: '100%',
        height: '90%',
        position: 'absolute'
    },
    paperLeft: {
        flex: 1,
        height: '100%',
        margin: 10,
        textAlign: 'center',
        overflow: 'auto',
    },
    paperRight: {
        height: '100%',
        flex: 1,
        margin: 10,
        textAlign: 'center',
    }
};

class CreateACV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempSections: [],
            sections: [],
            key: 1,
            section: "",
            selectedSections: null,
            initalSections: null,
            pdfText: "",
            textParams: "",
            sectionsWithParamsArray: [],
            paramWithParamValues: [],
            loaded: 0,
            paramsOnly: []

        }
        this.username = sessionStorage.getItem('user');
        this.cvID = sessionStorage.getItem('newCV');
    }

    componentWillMount() {


        axios.get("http://localhost:8081/templateWithSections?tempID=" + sessionStorage.getItem('chosenTempIDView'))
            .then(res => {
                const tempSections = res.data;
                let array = [];
                this.setState({ initalSections: tempSections })
                for (var i = 0; i < tempSections.length; i++) {
                    array.push(tempSections[i].idSection);
                }
                axios.get("http://localhost:8081/sections")
                    .then(res => {
                        const sections = res.data;
                        this.setState({ sections });
                        this.setState({ selectedSections: array }, () => this.handlePDFText2());
                        this.setState({ loaded: 1 });

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

/*     handleSave() {

        var headers1 = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }

        if (this.state.paramWithParamValues.length != 0) {
            for (var i = 0; i < this.state.paramWithParamValues.length; i++) {
                let indeks = i;
                let stringValue = null;
                let intValue = null;
                let booleanValue = null;
                let doubleValue = null;
                let textValue = null;
                let jsonValue = null;
                let imageValue = null;
                let dateValue = null;
                switch (this.state.paramWithParamValues[indeks].param.classType) {
                    case "java.lang.String":
                        stringValue = this.state.paramWithParamValues[indeks].value;
                        break;
                    case "java.util.Date":
                        var dateStringValue = this.state.paramWithParamValues[indeks].value;
                        // var year= dateStringValue.substring(0,3);
                        // var month= dateStringValue.substring(0,3);
                        // var day= dateStringValue.substring(0,3);

                        // dateValue = new Date(dateStringValue);
                        // dateValue = this.state.paramWithParamValues[indeks].value;
                        dateValue = new Date();
                        break;
                    case "java.lang.Integer":
                        intValue = this.state.paramWithParamValues[indeks].value;
                        break;

                }

                let data1 = {
                    "stringValue": stringValue,
                    "intValue": intValue,
                    "booleanValue": booleanValue,
                    "doubleValue": doubleValue,
                    "textValue": textValue,
                    "jsonValue": jsonValue,
                    "imageValue": imageValue,
                    "dateValue": dateValue,
                    "cvId": { "id": this.cvID },
                    "templateParamId": { "id": this.state.paramWithParamValues[indeks].param.id }
                }
                axios.post('http://localhost:8081/saveCVDetail', data1, headers1)

                    .then((res) => {
                        // const newTemplate = res.data;
                        // this.setState({ noviKorisnik }, this.odvediNaPocetnu);
                        console.log("RESPONSE RECEIVED: ", res);
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    })
            }
        }

    } */
	
	handleSave() {
        this.props.alert.success(<div style={{ color: 'white' }}>CV details are saved!</div>);
        this.props.history.push({
            pathname: '/home'
        })
        var headers1 = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data1 = [];
        if (this.state.paramWithParamValues.length != 0) {
            for (var i = 0; i < this.state.paramWithParamValues.length; i++) {
                let indeks = i;
                let stringValue = null;
                let intValue = null;
                let booleanValue = null;
                let doubleValue = null;
                let textValue = null;
                let jsonValue = null;
                let imageValue = null;
                let dateValue = null;
                switch (this.state.paramWithParamValues[indeks].param.classType) {
                    case "java.lang.String":
                        stringValue = this.state.paramWithParamValues[indeks].value;
                        break;
                    case "java.util.Date":
                        var dateStringValue = this.state.paramWithParamValues[indeks].value;
                        // var year= dateStringValue.substring(0,3);
                        // var month= dateStringValue.substring(0,3);
                        // var day= dateStringValue.substring(0,3);

                        // dateValue = new Date(dateStringValue);
                        // dateValue = this.state.paramWithParamValues[indeks].value;
                        dateValue = new Date();
                        console.log(dateValue);
                        break;
                    case "java.lang.Integer":
                        intValue = this.state.paramWithParamValues[indeks].value;
                        break;

                }

                let jsonObject = {
                    "stringValue": stringValue,
                    "intValue": intValue,
                    "booleanValue": booleanValue,
                    "doubleValue": doubleValue,
                    "textValue": textValue,
                    "jsonValue": jsonValue,
                    "imageValue": imageValue,
                    "dateValue": dateValue,
                    "cvId": { "id": this.cvID },
                    "templateParamId": { "id": this.state.paramWithParamValues[indeks].param.id }
                }
                data1.push(jsonObject);
            }
            axios.post('http://localhost:8081/saveCVDetail', data1, headers1)

                .then((res) => {
                    console.log("RESPONSE RECEIVED: ", res);
                    // this.props.alert.success(<div style={{ color: 'white' }}>CV details are saved!</div>);
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                    //this.props.alert.error(<div style={{ color: 'white' }}>Error! We could not save this CV details!</div>);
                })

        }

    }

    handleCancel() {
        axios.delete("http://localhost:8081/deleteCV?cvID=" + this.cvID)
            .then(res => {
                console.log(res.data);
                this.props.history.push({
                    pathname: '/home'
                })

            })


    }

    // vratiSekcije() {
    //     this.state.sectionsWithParamsArray.map((val) =>
    //         return (<h2>{val.sectionName.name} </h2>)
    //     );

    // }
    setParamValue(paramWithValueObject) {
        let index = findWithAttr(this.state.paramWithParamValues, 'param', paramWithValueObject.param);
        if (paramWithValueObject.value != "") {
            var paramWithParamValues = this.state.paramWithParamValues;
            var paramsOnly = this.state.paramsOnly;

            if (index !== -1) {//ako element vec postoji u nizu, tj ako se ponovo vrati na neki text field
                if (this.state.paramWithParamValues[index].value !== paramWithValueObject.value) {
                    const newArray = this.state.paramWithParamValues.slice() //copy the array
                    newArray[index].value = paramWithValueObject.value //execute the manipulations
                    this.setState({ paramWithParamValues: newArray }) //set the new state
                }
            }
            else {//ako prvi put upisuje u taj text field
                paramWithParamValues.push(paramWithValueObject);
                paramsOnly.push(paramWithValueObject.param)
                this.setState({ paramWithParamValues });
                this.setState({ paramsOnly });
            }
            // ako je obrisao tekst iz nekog text fielda koji je prethodno popunio
        } else if (index != -1) {
            const newArray = this.state.paramWithParamValues.slice();
            newArray[index].value = "";
            this.setState({ paramWithParamValues: newArray });
        }

        if (this.state.paramWithParamValues.length !== 0) {
            for (var i = 0; i < this.state.paramWithParamValues.length; i++) {
                console.log(this.state.paramWithParamValues[i].param.name + "vrednost: " + this.state.paramWithParamValues[i].value);
            }
        }

    }

    insertTextField(par) {
        return(
        <div >
            <TextField
                hintText={par.name}
                floatingLabelText={par.name}

                onBlur={(newValue) => this.setParamValue({ param: par, value: newValue.target.value })}
            />
        </div>
        )
    }

    render() {

        const stylesPDF = StyleSheet.create({
            page: {
                paddingTop: 35,
                paddingBottom: 65,
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
                marginBottom: 20,
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
            <PDFViewer width="90%" height="600px">
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

                                        {this.state.sectionsWithParamsArray[i].params.map((par, j) =>
                                            this.state.paramWithParamValues.length != 0 && this.state.paramsOnly.includes(par) ? (
                                                <Text key={j} style={stylesPDF.text}>{par.name} : {this.state.paramWithParamValues[findWithAttr(this.state.paramWithParamValues, 'param', par)].value}</Text>
                                            ) : (
                                                    <Text key={j} style={stylesPDF.text}>{par.name}</Text>
                                                )
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
            </PDFViewer>
        );

        if (this.state.loaded === 1) {
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <MenuAppBar
                                title="Create your CV"
                                username={this.username}
                                history={this.props.history}
                            />
                        </div>
                        <div style={styles.div}>
                            <Paper zDepth={3} style={styles.paperLeft}>
                                {/* <MultiStep showNavigation={true} steps={steps}/> */}
                                {this.state.sectionsWithParamsArray.map((val, i) =>
                                    <div>
                                        <h2>{val.sectionName.name} </h2>
                                        {this.state.sectionsWithParamsArray[i].params.map((par, j) =>
                                            <div>
                                                <TextField
                                                    hintText={par.name}
                                                    floatingLabelText={par.name}

                                                    onBlur={(newValue) => this.setParamValue({ param: par, value: newValue.target.value })}
                                                />
                                                {/* <Button variant="fab" color="primary" aria-label="Add" size="mini" onClick={() => this.insertTextField(par)}>
                                                    <AddIcon />
                                                </Button> */}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <br />
                                <RaisedButton label="Save your CV" primary={true} onClick={(event) => this.handleSave(event)} style={{ marginRight: '10px' }} />
                                <RaisedButton label="Cancel" primary={true} onClick={(event) => { if (window.confirm('Do you really want to cancel?')) this.handleCancel() }} style={{ marginRight: '10px' }} />
                            </Paper>
                            <br />

                            <Paper zDepth={3} style={styles.paperRight}>
                                <MyDocument />
                            </Paper>

                        </div>
                    </MuiThemeProvider>

                </div>
            )
        } else {
            return (
                <h1>Loading....</h1>
            )
        }

    }
};
export default withAlert(CreateACV);
