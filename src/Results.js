import React from 'react';
import axios from 'axios';

class Results extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            testers: [],
            results: []
        }
    }

    componentDidMount() {
        this.getTesters();
    }

    getTesters = () => {
        axios.get(`/api/testers`)
            .then(res => {
                this.setState({ testers: res.data });
            })
    };

    render() {
        const { testers } = this.state;

        return (
            <React.Fragment>
                <div className="row mb-3">
                    <div className="col">
                        <h3>
                            Relevance Scoring Results
                        </h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <h4>Testers</h4>
                        <ul>
                            {testers.map((tester, idx) => (
                                <li key={idx}>
                                    <button className="btn btn-link" type="button">{tester.tester.split('_').pop()} <small>{tester.nbQueries}</small></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-9">
                        <h4>Results</h4>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default Results;