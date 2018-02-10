import React from 'react';
import Type from "./Type";

export default class Option extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cls: props.class,
            name: props.name,
            required: props.required,
            default_value: props.default_value,
            is_lazy: props.is_lazy,
            allowed_types: props.allowed_types,
            allowed_values: props.allowed_values,
            has_normalizer: props.has_normalizer,
            show_definition: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.setState(prevState => ({
            show_definition: !prevState.show_definition
        }));
    };

    handleBlur(event) {
        event.preventDefault();
        this.setState({show_definition: false});
    };

    render() {
        const {
            cls, name, required,
            default_value, is_lazy,
            allowed_types, allowed_values,
            has_normalizer, show_definition
        } = this.state;

        const id = Type.get_class_name(cls) + '/' + name;
        const stringify = JSON.stringify(default_value, null, ' ');

        return (
            <div title={required ? 'Required' : ''}
                 className={show_definition ? 'selected' : ''}
                 onBlur={this.handleBlur}
            >
                <a href={'#' + id} id={id} onClick={this.handleClick}><code>{name}</code>{required ? '*' : ''}</a>
                <div className="option-definition" hidden={!show_definition}>
                    {undefined !== default_value && <div>- Default value: {'{}' === stringify ? '[object]' : stringify}</div>}
                    {is_lazy && <div>- Has lazy default function.</div>}
                    {allowed_types && <div>- Allowed types: {JSON.stringify(allowed_types, null, ' ')}</div>}
                    {allowed_values && <div>- Allowed values: {JSON.stringify(allowed_values, null, ' ')}</div>}
                    {has_normalizer && <div>- Has normalizer function.</div>}
                    {required && <div>- Required.</div> || <div>- Optional.</div>}
                </div>
            </div>
        )
    }
}
