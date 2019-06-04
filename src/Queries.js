import React from 'react';
import { connectHits } from 'react-instantsearch-dom';
import { Redirect } from "react-router-dom";

import CustomSearchBox from './CustomSearchBox';

const Hits = ({ hits, attributesToDisplay, imageAttribute }) => {
    return (
        <div className="ais-Hits">
            <div className="ais-Hits-list">
                {hits.map((hit, idx) => (
                    <div className="ais-Hits-item p-2" key={idx}>
                        <picture>
                            {imageAttribute && hit[imageAttribute] &&
                                <img src={hit[imageAttribute]} alt={hit[imageAttribute]} />
                            }
                        </picture>
                        <section>
                            {attributesToDisplay.map((attribute, idx) => (
                                <p className="ais-Hits-content" key={idx}>
                                    <small>{attribute}</small><br />
                                    <strong>{hit[attribute]}</strong>
                                </p>
                            ))}
                        </section>
                        <span className="ais-Hits-position">#{idx + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    )
};

const CustomHits = connectHits(Hits);

class Queries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            choice: false,
            issueDescription: '',
        }
    }

    onIrrelevantClicked = () => {
        this.setState({ choice: 'IRRELEVANT' });
    };

    onMisplacedClicked = () => {
        this.setState({ choice: 'MISPLACED' });
    };

    onRelevantClicked = () => {
        this.props.onNextQuery(this.props.query, 'RELEVANT', '');
        this.reset();
    };

    onNextQueryClicked = () => {
        this.props.onNextQuery(this.props.query, this.state.choice, this.state.issueDescription);
        this.reset();
    };

    onIDontKnowClicked = () => {
        this.props.onNextQuery(this.props.query, 'SKIPPED', '');
        this.reset();
    };

    reset = () => {
        this.setState({ choice: false, issueDescription: '' });
    };

    render() {
        const { testerEmailAddress, query, queriesCount, attributesToDisplay, imageAttribute } = this.props;
        const { choice, issueDescription } = this.state;

        if (!testerEmailAddress) {
            return <Redirect to="/" />
        }

        return (
            <div className="rs-Queries">
                <div className="row">
                    <div className="col-md-6">
                        <CustomSearchBox query={query} />
                    </div>
                    <div className="col-md-6 text-right">
                        <p className="h3 mb-0">Relevance Scoring Tool</p>
                        <small>{testerEmailAddress}</small>
                    </div>
                </div>
                <br />
                <div className="row align-items-start">
                    <div className="col-8">
                        {query
                            ? <CustomHits attributesToDisplay={attributesToDisplay} imageAttribute={imageAttribute} />
                            : <p><strong>No more query to evaluate.</strong><br />Thank you!</p>
                        }
                    </div>
                    {query &&
                        <div className="col-4 rs-Queries-actions">
                            <p className="mb-4">
                                <small>{queriesCount} querie(s) tested.</small>
                            </p>
                            <div className="text-center">
                                <button type="button" className={`btn ${choice && choice === 'IRRELEVANT' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => this.onIrrelevantClicked()}>Irrelevant</button>&nbsp;&nbsp;
                                <button type="button" className={`btn ${choice && choice === 'MISPLACED' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => this.onMisplacedClicked()}>Misplaced</button>&nbsp;&nbsp;
                                <button type="button" className={`btn btn-outline-success`} onClick={() => this.onRelevantClicked()}>Relevant</button>
                            </div>
                            {choice && choice !== 'RELEVANT' &&
                            <React.Fragment>
                                <div className="form-group mt-4">
                                    <label htmlFor="issueDescription" className="mb-1">What is the issue?*</label>
                                    <textarea className="form-control" id="issueDescription" rows="3" onChange={e => this.setState({ issueDescription: e.target.value })} value={issueDescription} />
                                    <small><u>Mandatory</u>. Don't forget to include item #.</small>
                                </div>
                                <br />
                                <div className="text-center mt-4 mb-2">
                                    <button type="button" className="btn btn-sm btn-link" onClick={() => this.onIDontKnowClicked()}>I don't know</button>
                                    <button type="button" className="btn btn-primary" onClick={() => this.onNextQueryClicked()} disabled={issueDescription === ''}>Next Query</button>
                                </div>
                            </React.Fragment>
                            }

                            {!choice &&
                            <p className="text-center mt-1">
                                <button type="button" className="btn btn-sm btn-link" onClick={() => this.onIDontKnowClicked()}>I don't know</button>
                            </p>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Queries;