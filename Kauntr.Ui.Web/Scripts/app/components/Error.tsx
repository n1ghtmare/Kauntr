import * as React from "react";

interface ErrorProps {
    code: string;
    subMessage: string;
};

export default class Error extends React.Component<ErrorProps, any> {
    render() {
        return (
            <div className="error-wrapper">
                <div className="error-message">
                    <p className="error-code">{this.props.code}</p>
                    <p>:(</p>
                    <p>{this.props.subMessage}</p>
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}