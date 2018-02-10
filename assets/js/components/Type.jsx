import React from 'react';
import Option from './Option'

export default class Type extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            cls: props.cls,
            api: props.api,
            block_prefix: props.block_prefix,
            options: props.options,
            parent_types: props.parent_types,
            type_extensions: props.type_extensions,
        };
    }

    static get_class_name(cls) {
        return cls.split('\\').slice(-1)[0];
    }

    render_options(options) {
        let i = 0;
        let result = [];
        for (let cls in options) {
            if (cls !== this.state.cls) {
                const className = Type.get_class_name(cls);
                result.push(
                    <div key={cls} className="option-group">
                        <a href={'#' + className}>{className}</a>
                    </div>
                );
            }
            options[cls].map(option => {
                result.push(
                    <Option key={i++}
                            class={this.state.cls}
                            name={option.name}
                            required={option.required}
                            is_lazy={option.is_lazy}
                            has_normalizer={option.has_normalizer}
                            default_value={option.default}
                            allowed_types={option.allowed_types}
                            allowed_values={option.allowed_values}
                    />)
            })
        }
        return result;
    }

    render_parent_types(col_span) {
        const parent_types = this.state.parent_types;

        if (0 === parent_types.length) {
            return;
        }

        return [
            <tr key={0}>
                <th colSpan={col_span}>Parent types</th>
            </tr>,
            <tr key={1}>
                <td colSpan={col_span}>
                    {parent_types.map((parent_class, index) => {
                        const className = Type.get_class_name(parent_class);
                        return <a key={index} href={'#' + className} className="mr-0-5"><code>{className}</code></a>
                    })}
                </td>
            </tr>
        ]
    }

    render_type_extensions(col_span) {
        const type_extensions = this.state.type_extensions;

        if (0 === type_extensions.length) {
            return;
        }

        return [
            <tr key={0}>
                <th colSpan={col_span}>Type extensions</th>
            </tr>,
            <tr key={1}>
                <td colSpan={col_span}>
                    {type_extensions.map((extensions_class, index) => {
                        const className = Type.get_class_name(extensions_class);
                        return <a key={index} href={'#' + className} className="float-left mr-0-5"><code>{className}</code></a>;
                    })}
                </td>
            </tr>
        ]
    }

    render() {
        const {name, cls, api, block_prefix, options} = this.state;
        const col_span = (0 !== options.own.length) + (0 !== options.overridden.length) + (0 !== options.parent.length) + (0 !== options.extension.length);
        const col_width = (100 / col_span).toFixed(0) + '%';

        return (
            <div>
                <h3 id={name}><a href={'#' + name}>{name}</a></h3>
                <blockquote>
                    <p>
                        Block prefix: <code>{block_prefix}</code><br/>
                        Class: <a href={api}><code>{cls}</code></a>
                    </p>
                </blockquote>
                <table>
                    <caption>Options</caption>
                    <thead>
                    <tr>
                        {0 !== options.own.length && <th width={col_width}>Own</th>}
                        {0 !== options.overridden.length && <th width={col_width}>Overridden</th>}
                        {0 !== options.parent.length && <th width={col_width}>Parent</th>}
                        {0 !== options.extension.length && <th width={col_width}>Extension</th>}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {0 !== options.own.length && <td>{this.render_options(options.own)}</td>}
                        {0 !== options.overridden.length && <td>{this.render_options(options.overridden)}</td>}
                        {0 !== options.parent.length && <td>{this.render_options(options.parent)}</td>}
                        {0 !== options.extension.length && <td>{this.render_options(options.extension)}</td>}
                    </tr>
                    {this.render_parent_types(col_span)}
                    {this.render_type_extensions(col_span)}
                    </tbody>
                </table>
            </div>
        );
    }
}
