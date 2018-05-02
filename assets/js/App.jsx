import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Type from './components/Type'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: [],
            selected: null,
            error: null,
            is_loaded: false,
            version: null,
            updated_at: null,
            composer_info: null,
            types: [],
            type_extensions: [],
            type_guessers: []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        fetch('docs.json')
            .then(data => data.json())
            .then(docs => {
                this.setState({
                    versions: docs.versions,
                    selected: docs.versions[0],
                });

                this.fetchDocs(docs.versions[0]);
            });
    }

    handleClick(version) {
        if (version === this.state.selected) {
            return;
        }

        this.setState({
            selected: version,
        });

        this.fetchDocs(version);
    };

    fetchDocs(version) {
        fetch(version + '.json')
            .then(data => data.json())
            .then((result) => {
                    this.setState({
                        is_loaded: true,
                        version: result.version,
                        updated_at: result.updated_at,
                        composer_info: result.composer_info,
                        types: result.types,
                        type_extensions: result.type_extensions,
                        type_guessers: result.type_guessers
                    });

                    // after update state, check by hash to scroll in
                    const hash = window.location.hash;
                    if (hash) {
                        window.location.hash = null;
                        window.location.hash = hash;
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        is_loaded: true,
                        error
                    });
                });
    }

    render() {
        const {
            error, is_loaded,
            versions, selected, version, updated_at, composer_info,
            types, type_extensions, type_guessers
        } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }
        if (!is_loaded) {
            return '';
        }

        return (
            <div>
                <section className="page-header">
                    <h1 className="project-name">Form Types Reference</h1>
                    <h2 className="project-tagline">Symfony comes standard with a large group of field types that cover all of the common form fields and data types you'll encounter.</h2>

                    <a href="https://github.com/phptopup/symfony-form" className="btn">View on GitHub</a>
                    <a href="https://github.com/phptopup/symfony-form/zipball/master" className="btn">Download .zip</a>
                    <a href="https://github.com/phptopup/symfony-form/tarball/master" className="btn">Download .tar.gz</a>
                </section>

                <section className="main-content">
                    <div className="sf-doc-versions-container">
                        {versions.map((v) => (
                            <code key={v} className={v === selected ? 'selected' : ''} onClick={() => this.handleClick(v)}>{v}</code>
                        ))}
                    </div>

                    <h2 id="types">Built-in Field Types</h2>
                    <div style={{display: 'inline-block'}}>
                        {types.map(type => (
                            <a key={type.name} href={'#' + type.name} title={type.class} className="float-left mr-0-5"><code>{type.name}</code></a>
                        ))}
                    </div>

                    <h2 id="types">Type Extensions</h2>
                    <div style={{display: 'inline-block'}}>
                        {type_extensions.map(type => (
                            <a key={type.name} href={'#' + type.name} title={type.class} className="float-left mr-0-5"><code>{type.name}</code></a>
                        ))}
                    </div>

                    <h2 id="types">Type Guessers</h2>
                    <div style={{display: 'inline-block'}}>
                        {type_guessers.map(type => (
                            <a key={type.name} href={'#' + type.name} title={type.class} className="float-left mr-0-5"><code>{type.name}</code></a>
                        ))}
                    </div>
                </section>

                <section className="build-info-container">
                    <div className="build-info">
                        <div>Symfony version: <strong>{version}</strong> <span className="composer-info-container"> ( <span className="composer-info-label">Composer Info</span> ) <div className="composer-info"><pre><code>{composer_info}</code></pre></div></span></div>
                        <div>Last update: <strong>{updated_at}</strong></div>
                    </div>
                </section>

                <section className="main-content">
                    {types.map(type => (
                        <Type
                            key={type.name}
                            name={type.name}
                            cls={type.class}
                            api={type.api}
                            block_prefix={type.block_prefix}
                            options={type.options}
                            parent_types={type.parent_types}
                            type_extensions={type.type_extensions}
                        />
                    ))}

                    <footer className="site-footer">
                        <span className="site-footer-owner"><a href="https://phptopup.github.io/symfony-form/index.html">This page</a> is maintained by <a href="https://github.com/yceruto">Yonel Ceruto</a>.</span>
                        <span className="site-footer-credits">The content of this page was generated by <a href="https://github.com/phptopup/symfony-form">phptopup/symfony-form</a>.</span>
                    </footer>
                </section>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);