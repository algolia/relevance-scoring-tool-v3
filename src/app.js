import React from 'react';
import store from 'store';
import axios from 'axios';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Login from './Login';
import Queries from './Queries';
import Results from './Results';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: false,
      emailAddress: store.get('testerEmailAddress') || '',
      currentQueryIndex: store.get('currentQueryIndex') || 0
    };

    this.searchClient = null;
    this.testerIndexClient = null;
  }

  componentDidMount() {
    axios.get(`/api/settings`)
        .then(res => {
          this.searchClient = algoliasearch(res.data.appId, res.data.searchApiKey);
          this.setState({ settings: res.data });
        })
  }

  onLogin = (emailAddress, callback) => {
    this.setState({ emailAddress }, () => {
      store.set('testerEmailAddress', emailAddress);
      this.testerIndexClient = this.searchClient.initIndex(`results_${emailAddress}`);
      callback();
    });
  };

  onNextQuery = (query, status, comment) => {
    axios.post(`/api/answers`, {
        appId: this.state.settings.appId,
        indexName: this.state.settings.indexName,
        user: this.state.emailAddress,
        query,
        status,
        comment,
        timestamp: Math.round(+new Date() / 1000)
    })
        .then(res => {
          this.setState(prevState => ({ currentQueryIndex: prevState.currentQueryIndex + 1 }), () => {
            store.set('currentQueryIndex', this.state.currentQueryIndex);
          });
        });
  };

  render() {
    const { settings, emailAddress, currentQueryIndex } = this.state;

    if (!settings) {
      return <p className="text-center h4 mt-4">Loading…</p>
    }

    return (
        <div className="container">
          <Router>
            <Route exact path="/" render={() => (
                emailAddress !== ''
                    ? <Redirect to="/queries" />
                    : <Redirect to="/login" />
            )}/>
            <Route path="/login" render={() => <Login onLogin={this.onLogin} />} />
            <Route path="/queries" render={() =>
                <InstantSearch searchClient={this.searchClient} indexName={settings.indexName}>
                  <Queries query={settings.queries[currentQueryIndex]}
                           queriesCount={currentQueryIndex}
                           onNextQuery={this.onNextQuery}
                           attributesToDisplay={settings.attributesToDisplay}
                           imageAttribute={settings.imageAttribute}
                           testerEmailAddress={emailAddress} />
                </InstantSearch>
            } />
            <Route path="/results" component={Results} />
          </Router>
        </div>
    )
  }
}

export default App;
