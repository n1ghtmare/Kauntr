import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";

export default class CountdownList extends React.Component<any, any> {
    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>countdowns / trending</h3>
                    <h4>37</h4>
                    <div>
                        countdown list here ...
                    </div>
                </div>
            </div>
        );
    }
}