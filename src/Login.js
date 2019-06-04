import React from 'react';
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emailAddress: ""
        }
    }

    onLogin = () => {
        const { onLogin, history } = this.props;
        const { emailAddress } = this.state;

        onLogin(emailAddress, () => { history.push('/queries'); })
    };

    render() {
        const { emailAddress } = this.state;

        return (
            <div className="row">
                <div className="col-md-4">
                    <h2>Relevance Scoring Tool</h2>
                    <br />
                    <form>
                        <div className="form-group">
                            <label htmlFor="testerEmailAddress">Your email address:</label>
                            <input type="email"
                                   value={emailAddress}
                                   onChange={e => this.setState({ emailAddress: e.target.value })}
                                   className="form-control"
                                   id="testerEmailAddress"
                                   aria-describedby="testerEmail"
                                   placeholder="john@doe.net" />
                            <small id="emailHelp" className="form-text text-muted">
                                We'll never share your email with anyone else.
                            </small>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => this.onLogin()}>Start!</button>
                    </form>
                </div>
            </div>
        )
    }

}

export default withRouter(Login);