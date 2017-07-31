import * as React from "react";

import CountdownState from "../interfaces/CountdownState";

export default class Countdown extends React.Component<CountdownState, any> {
    // TODO - write the actual implementation of the countdown here (load comments if necessary)
    // TODO - get the gravatar url from server
    render() {
        return (
            <div>
                <div className="text-medium">
                    <div>3 days 4 hours 33 minutes 5 seconds</div>
                    <div>until <a href="#">{this.props.description}</a></div>
                </div>
                <div>created 3 days ago</div>
                <div>by <a href="#">Haxor</a></div>
                <div className="avatar-image-container">
                    <img width="52" height="52" alt="Avatar Image" src="http://www.gravatar.com/avatar/3c65be11257c594389753a6b5de12569?s=52&amp;d=mm" />
                </div>
                <div className="text-medium countdown-score">
                    <a title="This is awesome" className="vote-up" href="#">&#43;</a>
                    <span>0</span>
                    <a title="I don't like it" className="vote-down" href="#">&minus;</a>
                </div>
            </div>
        );
    }
}