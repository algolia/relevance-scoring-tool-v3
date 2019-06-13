import React from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import queryString from "query-string";

class Results extends React.Component {
  constructor(props) {
    super(props);

    const queryParameters = queryString.parse(this.props.location.search);

    this.state = {
      selectedTester: false,
      testers: [],
      results: [],
      authenticated: null,
      authCode: queryParameters.magic
    };
  }

  componentDidMount() {
    this.getTesters();
  }

  getTesters = () => {
    axios
      .get(`/api/testers?authCode=${this.state.authCode}`)
      .then(res => {
        this.setState({ testers: res.data, authenticated: true });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({ authenticated: false });
        }
      });
  };

  getResultsForTester = tester => {
    axios
      .get(`/api/results/${tester}?authCode=${this.state.authCode}`)
      .then(res => {
        this.setState({ results: res.data });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({ authenticated: false });
        }
      });
  };

  selectTester = selectedTester => {
    this.setState({ selectedTester }, () =>
      this.getResultsForTester(selectedTester)
    );
  };

  render() {
    const { testers, selectedTester, results, authenticated } = this.state;

    if (authenticated !== true) {
      return (
        <>
          <h3>Authentication required.</h3>
          <p>You need to be logged-in to access this page.</p>
        </>
      );
    }

    return (
      <React.Fragment>
        <div className="row mb-4">
          <div className="col">
            <h3>Relevance Scoring</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <h4>Testers</h4>
            <ul>
              {testers.map((tester, idx) => (
                <li key={idx} onClick={() => this.selectTester(tester.tester)}>
                  {tester.tester.split("_").pop()} ({tester.nbQueries})
                </li>
              ))}
            </ul>
          </div>
          <div className="col-9">
            <h4>Results</h4>
            {(!selectedTester || (selectedTester && !results.length)) && (
              <p>No results to display.</p>
            )}

            {selectedTester && results.length && (
              <React.Fragment>
                <p className="text-right mb-1">
                  <CSVLink data={results} filename={`${selectedTester}.csv`}>
                    <small>Download as .csv file</small>
                  </CSVLink>
                </p>
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Query</th>
                      <th scope="col">Status</th>
                      <th scope="col">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr key={idx}>
                        <th scope="row">{result.query}</th>
                        <td>
                          {result.status === "RELEVANT" && (
                            <span className="badge badge-pill badge-success">
                              {result.status}
                            </span>
                          )}
                          {result.status === "MISPLACED" && (
                            <span className="badge badge-pill badge-warning">
                              {result.status}
                            </span>
                          )}
                          {result.status === "IRRELEVANT" && (
                            <span className="badge badge-pill badge-danger">
                              {result.status}
                            </span>
                          )}
                          {result.status === "SKIPPED" && (
                            <span className="badge badge-pill badge-info">
                              {result.status}
                            </span>
                          )}
                        </td>
                        <td>{result.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Results;
