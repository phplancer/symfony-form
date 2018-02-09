import React from 'react';

export default class Types extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            types: []
        };
    }

    componentDidMount() {
        fetch('data/types.json')
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        types: result.types
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, types } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {types.map(type => (
                        <li key={type.class}>
                            <a href={type.api_link} title={type.class}>{type.name}</a>
                        </li>
                    ))}
                </ul>
            );
        }
    }
}
