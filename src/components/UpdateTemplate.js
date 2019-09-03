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
import Select from 'react-select'
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


class UpdateTemplate extends Component {
    constructor(props) {
        super(props);
        this.getSelectedSection = this.getSelectedSection.bind(this);
        this.state = {
            tempSections: [],
            titleT: "",
            sections: [],
            key: 1,
            section: "",
            selectedSections: null,
            initalSections: null,
            pdfText: "",
            textParams: "",
            sectionsWithParamsArray: [],
            templateCV: {},
            updatedTemplate: {},
            loaded: 0

        }
        this.username = sessionStorage.getItem('user');
    }

    componentWillMount() {


        axios.get("http://localhost:8081/templateWithSections?tempID=" + sessionStorage.getItem('chosenTempID'))
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
                        this.setState({ titleT: sessionStorage.getItem('chosenTempName') });
                        this.setState({ selectedSections: array }, () => this.handlePDFText2());
                        this.setState({ loaded: 1 });

                    })
                // this.setState({ tempSections },()=>this.getSelectedSection(array));


            })



    }

    getSelectedSection(selectedSectionsArray) {
        let selectedSections = [];
        if (selectedSectionsArray.length != 0) {
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
        console.log("aaaaaaaaaaaaaaa");
        let tempSectionsForUpdate = [];
        let sectionsForUpdate = [];
        var sectionsForDelete = [];
        var sectionsForPost = [];
        var inserted = false;
        const initalSectionsCompare = [];
        for (var i = 0; i < this.state.initalSections.length; i++) {
            initalSectionsCompare.push(this.state.initalSections[i].idSection);
            inserted = false;
            console.log("kkk");
            for (var j = 0; j < this.state.selectedSections.length; j++) {
                if (this.state.initalSections[i].idSection.id === this.state.selectedSections[j].id) {
                    tempSectionsForUpdate.push(this.state.initalSections[i]);
                    sectionsForUpdate.push(this.state.selectedSections[j]);
                    inserted = true;
                    // return;
                }
            }
            if (inserted === false) {
                sectionsForDelete.push(this.state.initalSections[i]);
            }
        }
        console.log("qaaaaaaaaaaaaaaa");
        if (sectionsForUpdate.length === 0) {
            sectionsForPost = this.state.selectedSections;
        }
        else {
            sectionsForPost = this.state.selectedSections.filter(comparer(initalSectionsCompare));
        }

        console.log("post length"+sectionsForPost.length);

        

        var headers = {
            'headers': {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        var data = {
            "id": sessionStorage.getItem('chosenTempID'),
            "name": this.state.titleT,
            "idUser": {
                "id": sessionStorage.getItem('userID')
            }
        }
        axios.put('http://localhost:8081/updateTemplate', data, headers)

            .then((res) => {
                const updatedTemplate = res.data;
                this.setState({ updatedTemplate });
                console.log("RESPONSE RECEIVED: ", res);
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            })

        if (sectionsForPost.length != 0) {
            for (var i = 0; i < sectionsForPost.length; i++) {
                let indeks=i;
                let indeks1 = this.state.selectedSections.findIndex(x=>x.id===sectionsForPost[i].id);
                console.log("redosled" + indeks1 + "sekcija:" + sectionsForPost[indeks].name);
                let dataPost = {
                    "sectionOrder": indeks1+1,
                    "numberOfAppearances": 1,
                    "idTemplate": { "id": sessionStorage.getItem('chosenTempID') },
                    "idSection": { "id": sectionsForPost[indeks].id }
                }
                axios.post('http://localhost:8081/saveTemplateWithSections', dataPost, headers)

                    .then((res) => {
                        console.log("POST RESPONSE RECEIVED: ", res);
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    })
            }
        }
        if (sectionsForDelete.length != 0) {
            for (var i = 0; i < sectionsForDelete.length; i++) {
                axios.delete("http://localhost:8081/deleteSectionFromTemplate?tempSectionID=" +sectionsForDelete[i].id)
                    .then(res => {
                        console.log("DELETE:"+res);
                        console.log(res.data);
                       
                    })
            }
        }
        if(tempSectionsForUpdate.length!=0){
            for (var i = 0; i < tempSectionsForUpdate.length; i++) {
                let indeks = i;
                let indeks1 = this.state.selectedSections.findIndex(x=>x.id===tempSectionsForUpdate[i].idSection.id);
                console.log("redosled" + indeks1 + "sekcija:" + sectionsForUpdate[indeks].name);
                let dataUpdate = {
                    "id":tempSectionsForUpdate[i].id,
                    "sectionOrder": indeks1+1,
                    "numberOfAppearances": 1,
                    "idTemplate": { "id": sessionStorage.getItem('chosenTempID') },
                    "idSection": { "id": sectionsForUpdate[indeks].id }
                }
                axios.post('http://localhost:8081/saveTemplateWithSections', dataUpdate, headers)

                    .then((res) => {
                        console.log("POST RESPONSE RECEIVED: ", res);
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    })
            }
        }
        this.props.history.push({
            pathname: '/home'
        })

    }

    handleCancel() {
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

        if (this.state.loaded === 1) {
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
                                title="Update Your Template"
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
                                    value={this.state.titleT}
                                    onChange={(event, newValue) => this.setState({ titleT: newValue })}
                                />
                                <hr />
                                <br />
                                <h3>Choose a section!</h3>
                                {/* <ComboBox sections={this.state.sections} sendSelectedSections={this.getSelectedSection} initialValues={initalValues} isMulti='true'></ComboBox> */}
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
                                <RaisedButton label="Save your changes" primary={true} onClick={(event) => this.handleSave(event)} style={{ marginRight: '10px' }} />
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
export default UpdateTemplate;
