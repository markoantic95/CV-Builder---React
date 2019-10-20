import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import { Page, Text, View, Document, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import ComboBox from "./ComboBox";
import SortableList from './SortableList';
import Select from 'react-select';
import { withAlert } from 'react-alert';
// import Background from 'images/backgroundPDF.jpg'
function comparer(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.id == current.id && other.name == current.name
        }).length == 0;
    }
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
        textAlign: 'center'
    },
    paperRight: {
        height: '100%',
        flex: 1,
        margin: 10,
        textAlign: 'center',
    }
};

class CreateATemplatePage extends Component {
    constructor(props) {
        super(props);
        this.getSelectedSection = this.getSelectedSection.bind(this);
        this.state = {
            titleT: "",
            sections: [],
            key: 1,
            section: "",
            selectedSections: [],
            pdfText: "",
            textParams: "",
            sectionsWithParamsArray: [],
            templateCV: {},
            newTemplate: {}

        }
        this.username = sessionStorage.getItem('user');
    }

    componentWillMount() {
       // this.props.alert.show(<div style={{ color: 'white' }}>New template is created!</div>);
        axios.get("http://localhost:8081/sections")
            .then(res => {
                const sections = res.data;
                this.setState({ sections });
            })

        var headers = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data = {

            "name": "My programmer template",
            "idUser": {
                "id": sessionStorage.getItem('userID')
            }
        }
        axios.post('http://localhost:8081/createATemplate', data, headers)

            .then((res) => {
                const newTemplate = res.data;
                this.setState({ newTemplate });
                console.log("RESPONSE RECEIVED: ", res);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })

    }

    getSelectedSection(selectedSectionsArray) {
        let selectedSections = [];
        if (selectedSectionsArray != null) {
            for (var i = 0; i < selectedSectionsArray.length; i++) {
                selectedSections.push({ id: selectedSectionsArray[i].id, name: selectedSectionsArray[i].label });
            }
        }
        this.setState({ selectedSections }, () => this.handlePDFText2());
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


    handleSave() {
        var headers = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data = {
            "id": this.state.newTemplate.id,
            "name": this.state.titleT,
            "idUser": {
                "id": sessionStorage.getItem('userID')
            }
        }
        axios.put('http://localhost:8081/updateTemplate', data, headers)

            .then((res) => {
                const newTemplate = res.data;
                this.setState({ newTemplate });
                console.log("RESPONSE RECEIVED: ", res);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })

        var headers1 = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data1 = [];
        if (this.state.selectedSections.length != 0) {
            for (var i = 0; i < this.state.selectedSections.length; i++) {
                let indeks = i;
                let jsonObject = {
                    "sectionOrder": indeks + 1,
                    "numberOfAppearances": 1,
                    "idTemplate": { "id": this.state.newTemplate.id },
                    "idSection": { "id": this.state.selectedSections[indeks].id }
                }
                data1.push(jsonObject);
            }
            axios.post('http://localhost:8081/saveTemplateWithSections1', data1, headers1)

                .then((res) => {
                    // const newTemplate = res.data;
                    // this.setState({ noviKorisnik }, this.odvediNaPocetnu);
                    console.log("RESPONSE RECEIVED: ", res);
                    this.props.alert.success(<div style={{ color: 'white' }}>Template with sections is saved!</div>);
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                    this.props.alert.error(<div style={{ color: 'white' }}>Error! We could not save this template with sections!</div>);
                })

        }
        this.goToHomePage();

    }

    handleCancel() {

        axios.delete("http://localhost:8081/deleteTemplate?tempID=" + this.state.newTemplate.id)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.goToHomePage();
            })
    }

    goToHomePage() {
        this.props.history.push({
            pathname: '/home'
        })
    }

    handleChange = (selectedOption) => {
        let selectedSections = [];
        if (selectedOption != null) {
            for (var i = 0; i < selectedOption.length; i++) {
                selectedSections.push({ id: selectedOption[i].id, name: selectedOption[i].label });
            }
        }
        this.setState({ selectedSections }, () => this.handlePDFText2());
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
                marginBottom: 10,
                marginTop: -5,
                marginLeft: -15,
                marginRight: -15,
                textAlign: 'center',
                color: 'grey',
            },
            subtitle: {
                fontSize: 14,
                marginLeft: -15,
                marginRight: -15,
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
            <Document key={this.state.key} title={this.state.titleT} width="90%" height="85vh" style={{ position: 'left' }} >
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


        var selectedOption = [];
        for (var i = 0; i < this.state.selectedSections.length; i++) {
            selectedOption.push({ id: this.state.selectedSections[i].id, value: this.state.selectedSections[i].name, label: this.state.selectedSections[i].name });
        }
        const options = [];
        if (this.state.sections.length != 0) {
            for (var i = 0; i < this.state.sections.length; i++) {
                options.push({ id: this.state.sections[i].id, value: this.state.sections[i].name, label: this.state.sections[i].name });
            }
        }


        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <MenuAppBar
                            title="Create Your Template"
                            username={this.username}
                            history={this.props.history}
                        />
                    </div>
                    <div style={styles.div}>
                        <Paper zDepth={3} style={styles.paperLeft}>
                            <h3>Enter template name</h3>
                            <TextField
                                hintText="Enter template title"
                                floatingLabelText="Title"
                                //  value={this.state.username}
                                //  onChange={this.handleChange}
                                onBlur={(newValue) => this.setState({ titleT: newValue })}
                            />
                            <hr />
                            <br />
                            <h3>Choose sections!</h3>
                            {/* <ComboBox sections={this.state.sections} sendSelectedSections={this.getSelectedSection} initialValues={this.state.selectedSections.length!=0?this.state.selectedSections:undefined} isMulti='true'></ComboBox> */}
                            <Select
                                isMulti='true'
                                isSearchable='true'
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={options}
                            />
                            <SortableList
                                sections={this.state.sections}
                                items={this.state.selectedSections}
                                onChange={(items) => {
                                    this.setState({ selectedSections: items }, () => this.handlePDFText2());
                                }}
                            >
                            </SortableList>
                            <br />
                            <RaisedButton label="Save your template" primary={true} onClick={(event) => this.handleSave(event)} style={{ marginRight: '10px' }} />
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

    }
};
export default withAlert(CreateATemplatePage);
