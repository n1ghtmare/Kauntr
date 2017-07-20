import * as React from "react";
import { Link } from "react-router";

interface ErrorProps {
    code: number;
    message: string;
    subMessage?: string;
};

export default class Error extends React.Component<ErrorProps, any> {
    render() {
        return (
            <div className="error-wrapper animated fadeIn">
                <div className="row">
                    <div>
                        <h1>{this.props.code}</h1>
                        <h2>:(</h2>
                        <h3>{this.props.subMessage}</h3>
                    </div>
                    <div>
                        {this.props.children}
                    </div>
                    <p><Link to="/" className="document-link">get me out of here</Link></p>
                </div>
            </div>
        );
    }
}