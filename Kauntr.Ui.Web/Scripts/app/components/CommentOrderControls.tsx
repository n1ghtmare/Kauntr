import * as React from "react";

// TODO - Add the implementation of ordering the comments
export default class CommentOrderControls extends React.Component<any, any> {
    render() {
        return (
            <div>
                <div>display order:</div>
                <ul className="comments-order-controls">
                    <li><a href="#">latest</a></li>
                    <li><a href="#">best</a></li>
                    <li className="active"><a className="disabled" href="#">oldest</a></li>
                </ul>
            </div>
        );
    }
}