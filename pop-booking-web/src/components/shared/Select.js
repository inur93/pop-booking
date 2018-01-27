import React from 'react';


export class Select extends React.Component {

    selectedList = [];

    constructor(props) {
        super(props);

        //already selected options
        this.selectedList = [];
        if (props.selected) {
            props.selected.forEach(x => this.selectedList.push(x));
        }
        this.state = {
            showOptions: false,
            hasValue: false,
            selected: this.selectedToString(),
            options: [],
            scrollHeight: document.body.scrollHeight
        }

    }

    componentWillReceiveProps = (nextProps) => {
        //check options that are already selected
        var options = nextProps.options;
        if (options) {
            var selOptions = [];
            options.forEach(el => {
                this.selectedList.find(s => s.id == el.id) ? el.selected = true : el.selected = false;
                selOptions.push(<Option
                    key={el.id}
                    id={el.id}
                    value={el.value}
                    selected={el.selected || false}
                    onClick={this.optionToggle} />)
            });

            this.setState({
                options: selOptions
            });
        }
    }

    shouldComponentUpdate = (nextProps, nextStates) => {
        return true;
    }

    // componentDidUpdate = (nextProps, nextStates) => {
    //     window.scrollTo(0,document.body.scrollHeight);
    // }

    optionToggle = (id, selected) => {
        var option = this.props.options.find(x => x.id === id && x);
        option.selected = selected;

        if (selected) {
            this.selectedList.push(option);
        } else {
            this.selectedList = this.selectedList.filter(x => x.id !== id);
        }

        this.setState({
            hasValue: this.selectedList.length > 0,
            selected: this.selectedToString()
        });
        this.props.onChange(this.selectedList);
    }

    selectedToString = () => {
        var hasValue = this.selectedList.length > 0;
        var valueStr = "";
        if (hasValue) {
            var values = this.selectedList.sort((a, b) => a.id > b.id);

            values.forEach(el => valueStr += el.value + ", ");
            valueStr = valueStr.substr(0, valueStr.length - 2);
        }
        return valueStr;
    }

    hideOptions = () => {
        this.setState({
            showOptions: false
        });
    }


    showOptions = () => {
        this.setState({
            showOptions: !this.state.showOptions
        });
    }

    clearOptions = () => {
        this.selectedList.forEach(x => this.optionToggle(x.id, false));
        this.setState({ showOptions: false });
    }

    render() {
        return (
            <div className="select-box-container select-box-multi">
                <button type="button" className="select-box" tabIndex={0} aria-hidden="true" onClick={this.showOptions}>

                    <div className="select-box-label">
                        {this.state.selected || this.props.placeholder}
                    </div>
                    
                </button>
                {
                    this.state.showOptions &&
                    <div className="select-box-options">
                        <div className="select-box-off-screen">
                            {this.state.options}
                        </div>
                        <button className="select-box-close" onClick={this.hideOptions}>
                            Close
                        </button>

                    </div>
                }
                {this.state.hasValue &&
                    <button className="select-box-clear" onClick={this.clearOptions}>
                    </button>
                }
                
            </div>
        );
    }
}

export class Option extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected || false
        }
    }

    onClick = (event) => {
        event.preventDefault();
        var selected = !this.state.selected;
        this.setState({
            selected: selected
        });
        this.props.onClick(this.props.id, selected);
    }

    render() {
        return (
            <a href="#" className={this.state.selected ? "select-box-option select-box-option-selected" : "select-box-option"} tabIndex={-1} onClick={this.onClick}>
                {this.props.value}
            </a>
        );
    }
}