import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Option from './Option'

export default class Type extends Component {
    constructor(props) {
        super(props);
    }

    static getClassName(cls) {
        return cls.split('\\').slice(-1)[0];
    }

    renderOptions(options) {
        let i = 0;
        let result = [];
        for (let cls in options) {
            if (cls !== this.props.cls) {
                const className = Type.getClassName(cls);
                result.push(
                    <div key={cls} className="option-group">
                        <a href={'#' + this.props.version + '/' + className}>{className}</a>
                    </div>
                );
            }
            options[cls].map(option => {
                const id = '#' + this.props.version + '/' + Type.getClassName(this.props.cls) + '/' + option.name;
                result.push(
                    <Option
                        key={i++}
                        cls={this.props.cls}
                        name={option.name}
                        required={option.required}
                        deprecated={option.deprecated}
                        deprecation_message={option.deprecation_message}
                        is_lazy={option.is_lazy}
                        has_normalizer={option.has_normalizer}
                        default_value={option.default}
                        allowed_types={option.allowed_types}
                        allowed_values={option.allowed_values}
                        show_definition={id === window.location.hash}
                        version={this.props.version}
                    />)
            })
        }
        return result;
    }

    renderParentTypes(colSpan) {
        const parent_types = this.props.parent_types;

        if (0 === parent_types.length) {
            return;
        }

        return [
            <tr key={0}>
                <th colSpan={colSpan}>Parent types</th>
            </tr>,
            <tr key={1}>
                <td colSpan={colSpan}>
                    {parent_types.map((parent_class, index) => {
                        const className = Type.getClassName(parent_class);
                        return <a key={index} href={'#' + this.props.version + '/' + className} className="mr-0-5"><code>{className}</code></a>
                    })}
                </td>
            </tr>
        ]
    }

    renderTypeExtensions(colSpan) {
        const type_extensions = this.props.type_extensions;

        if (0 === type_extensions.length) {
            return;
        }

        return [
            <tr key={0}>
                <th colSpan={colSpan}>Type extensions</th>
            </tr>,
            <tr key={1}>
                <td colSpan={colSpan}>
                    {type_extensions.map((extensions_class, index) => {
                        const className = Type.getClassName(extensions_class);
                        return <a key={index} href={'#' + this.props.version + '/' + className} className="float-left mr-0-5"><code>{className}</code></a>;
                    })}
                </td>
            </tr>
        ]
    }

    render() {
        const {name, cls, api, block_prefix, options, version} = this.props;
        const colSpan = (0 !== options.own.length) + (0 !== options.overridden.length) + (0 !== options.parent.length) + (0 !== options.extension.length);
        const col_width = (100 / colSpan).toFixed(0) + '%';

        return (
            <div>
                <h3 id={version + '/' + name}><a href={'#' + version + '/' + name}>{name}</a></h3>
                <blockquote>
                    <p>
                        Block prefix: <code>{block_prefix}</code><br/>
                        Class: <a href={api}><code>{cls}</code></a>
                    </p>
                </blockquote>
                <table>
                    <thead>
                    <tr>
                        {0 !== options.own.length && <th width={col_width}>Options</th>}
                        {0 !== options.overridden.length && <th width={col_width}>Overridden options</th>}
                        {0 !== options.parent.length && <th width={col_width}>Parent options</th>}
                        {0 !== options.extension.length && <th width={col_width}>Extension options</th>}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {0 !== options.own.length && <td>{this.renderOptions(options.own)}</td>}
                        {0 !== options.overridden.length && <td>{this.renderOptions(options.overridden)}</td>}
                        {0 !== options.parent.length && <td>{this.renderOptions(options.parent)}</td>}
                        {0 !== options.extension.length && <td>{this.renderOptions(options.extension)}</td>}
                    </tr>
                    {this.renderParentTypes(colSpan)}
                    {this.renderTypeExtensions(colSpan)}
                    </tbody>
                </table>
            </div>
        );
    }
}

Type.propTypes = {
    name: PropTypes.string.isRequired,
    cls: PropTypes.string.isRequired,
    api: PropTypes.string.isRequired,
    block_prefix: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    parent_types: PropTypes.array,
    type_extensions: PropTypes.array,
};
