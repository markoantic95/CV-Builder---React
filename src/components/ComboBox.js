import React from 'react';
import Select from 'react-select';



class ComboBox extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.state = {
            selectedOption:null,
        }
        
    }
    static defaultProps = {
        sections: [],
        isMulti:false,
        initalValues:null
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.selectedOption !== this.state.selectedOption) {
    //       let selectedOption=this.state.selectedOption
    //       this.setState({selectedOption});
    //     }
    //   }

    // static getDerivedStateFromProps(props, state) {
    //     // Any time the current user changes,
    //     // Reset any parts of state that are tied to that user.
    //     // In this simple example, that's just the email.
    //     if(props.initalValues!=null && state.selectedOption!=null)
    //     if (props.initialValues[0].id !== state.selectedOption[0].id) {
    //       return {
    //         selectedOption: props.initialValues
    //       };
    //     }
    //     else return null;
    //   }


    

    // componentDidUpdate(prevState) {
    //     // Typical usage (don't forget to compare props):
    //     if (this.state.selectedOption !== prevState.selectedOption) {
    //       this.setState({selectedOption:this.props.initalValues});
    //     }
    //   }
    // componentWillReceiveProps(newProps) {
    //     this.setState({selectedOption: newProps.initalValues});
    // }

    // shouldComponentUpdate(nextProps) {
    //     return this.state.selectedOption !== nextProps.initalValues;
    // }

    // componentWillReceiveProps(prevProps,newProps) {
    //     if (this.prevProps.initalValues !== newProps.initalValues) {
    //       this.setState({selectedOption: newProps.initalValues});
    //     }
    //   }

    handleChange = (selectedOption) => {
        for (var i = 0; i < selectedOption.length; i++) {
        }
        // this.setState({ selectedOption },()=>this.sendSections());
        // this.props.initalValues=selectedOption;
        this.sendSections(selectedOption);
    }

    sendSections(selectedOption){
        this.props.sendSelectedSections(selectedOption);
    }


    render() {
        
        const selectedOption= this.props.initalValues;
        if(selectedOption!=null){
        }
        const options = [];
        if (this.props.sections.length != 0) {
            for (var i = 0; i < this.props.sections.length; i++) {
                options.push({id:this.props.sections[i].id, value: this.props.sections[i].name, label: this.props.sections[i].name });
            }
        }
        
        // this.handleChange(selectedOption);
        return (
            <Select
                isMulti={this.props.isMulti} 
                isSearchable='true'
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
            />
        );
    }
}

export default ComboBox;