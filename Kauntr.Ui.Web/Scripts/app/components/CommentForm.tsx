import * as React from "react";

export default class CommentForm extends React.Component<any, any> {
    render() {
        return (
            <form className="form-section">
                <div>
                    <textarea className="textarea-large"></textarea>
                </div>
                <div>
                    <button type="submit" className="button button-medium">Add Comment</button>
                </div>
            </form>
        );
    }
}