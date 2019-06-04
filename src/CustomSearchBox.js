import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';


class CustomSearchBox extends React.Component {
    componentDidMount() {
        this.props.refine(this.props.query);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.query !== this.props.query) {
            this.props.refine(this.props.query);
        }
    }

    render() {
        const { currentRefinement } = this.props;

        if (!currentRefinement) {
            return false;
        }

        return (
            <p className="h3 ais-SearchBox-title">Results for: <strong><u>{currentRefinement}</u></strong></p>
        )
    }
}

export default connectSearchBox(CustomSearchBox);