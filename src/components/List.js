import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios'
import { withAlert } from 'react-alert';
import { compose } from 'recompose'
const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '50%',
        margin: 'auto',
        backgroundColor: theme.palette.background.paper,
        height: '50'

    },
    demo: {
        backgroundColor: "#f0f5f5",
        overflow: 'auto',
        height: '60vh',
        borderRadius: 5


    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
});

function generate(element) {
    return [0, 1, 2].map(value =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}
let fullList = [];
class InteractiveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listForTable: props.listForTable,
            update: 1,
            showAllButtons: props.showAllButtons,
            type: props.type
        }
    }

    handleDelete(val) {
        console.log(val);
        
        axios.delete("http://localhost:8081/deleteTemplate?tempID=" + val.id)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.props.alert.show(<div style={{ color: 'white' }}> This template is deleted! </div>);
            })
        var index = this.state.listForTable.indexOf(val);
        this.state.listForTable.splice(index, 1);
        this.setState({ update: 1 });

    }

    handleRequest(value) {
        var array = [];
        for (var i = 0; i < fullList.length; i++) {
            if (this.props.type === "template" && fullList[i].name.toUpperCase().includes(value.toUpperCase())) {
                array.push(fullList[i]);
            }
            if (this.props.type === "cv" && fullList[i].templateCvId.name.toUpperCase().includes(value.toUpperCase())) {
                array.push(fullList[i]);
            }
        }
        this.setState({ listForTable: array });
    }

    goToUpdatePage(chosenTemplate) {
        sessionStorage.setItem('chosenTempID', chosenTemplate.id);
        sessionStorage.setItem('chosenTempName', chosenTemplate.name);

        this.props.history.push({
            pathname: '/updateTemplate'
        })
    }

    goToPreviewPage(chosen) {
        if (this.props.type === "template") {
            sessionStorage.setItem('chosenTempIDView', chosen.id);
            sessionStorage.setItem('chosenTempNameView', chosen.name);
            this.props.history.push({
                pathname: '/viewTemplate'
            })
           
        }

        if (this.props.type === "cv") { 
            sessionStorage.setItem('chosenTempIDView', chosen.templateCvId.id);
            sessionStorage.setItem('chosenCVIDView', chosen.id);
            this.props.history.push({
                pathname: '/viewCV'
            })
        }
    }


    render() {
        const { classes } = this.props;
        fullList = this.props.listForTable;
        const { dense } = this.state;
        return (
            <div className={classes.root}>

                <SearchBar
                    onChange={(searchValue) => this.handleRequest(searchValue)}
                    onRequestSearch={() => console.log("Aaa")}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                />
                {this.props.type === "template" &&
                    <Typography variant="title" className={classes.title}>
                        List of Templates
                </Typography>
                }
                {this.props.type === "cv" &&
                    <Typography variant="title" className={classes.title}>
                        List of CVs
                </Typography>
                }

                <div className={classes.demo}>
                    <List dense={dense}>
                        {this.state.listForTable.map((val) =>
                            <ListItem button key={val.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <i class="material-icons">
                                            bubble_chart
                                        </i>
                                    </Avatar>
                                </ListItemAvatar>
                                {this.props.type === "template" &&
                                    <ListItemText
                                        primary={val.name}
                                    />
                                }
                                {this.props.type === "cv" &&
                                    <ListItemText
                                        primary={"CV for template: " + val.templateCvId.name + ", created: " + new Date(val.created).getDate() + "-" + (new Date(val.created).getMonth() + 1) + "-" + new Date(val.created).getFullYear()}
                                    />
                                }
                                <ListItemSecondaryAction>

                                    <IconButton aria-label="View" onClick={() => this.goToPreviewPage(val)} >
                                        <i class="material-icons">
                                            visibility
                                        </i>
                                    </IconButton>
                                    {this.props.showAllButtons &&
                                        <IconButton aria-label="Delete" onClick={() => { if (window.confirm('Do you really want to delete this template?')) this.handleDelete(val) }} >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    {this.props.showAllButtons &&
                                        <IconButton aria-label="Update" onClick={() => this.goToUpdatePage(val)} >
                                            <i class="material-icons">
                                                edit
                                        </i>
                                        </IconButton>
                                    }

                                </ListItemSecondaryAction>
                            </ListItem>

                        )}
                    </List>
                </div>
            </div>
        );
    }
}

InteractiveList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withAlert,
     withStyles(styles)
     )
     (InteractiveList);