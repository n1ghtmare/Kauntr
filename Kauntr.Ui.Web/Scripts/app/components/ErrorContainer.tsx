import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";
import ErrorState from "../interfaces/ErrorState";

import Error from "./Error";

export class ErrorContainer extends React.Component<ErrorState, any> {
    render() {
        return (
            <Error code={this.props.code} message={this.props.error}>
                <div className="text-error">
                    <p>{this.props.subError}</p>
                </div>
            </Error>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): ErrorState {
    return state.error;
}

export default connect(mapStateToProps, null)(ErrorContainer);