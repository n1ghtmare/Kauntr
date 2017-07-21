import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import CountdownForm from "./CountdownForm";

export class CountdownCreate extends React.Component<any, any> {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(updateSharedContextTitle("create"));
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>create a new countdown</h3>
                    <CountdownForm />
                </div>
            </div>
        );
    }
}

export default connect()(CountdownCreate);
