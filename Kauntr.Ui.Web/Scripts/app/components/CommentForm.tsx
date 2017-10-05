import * as React from "react";
import { Link } from "react-router";

type CommentSubmitFunc = (content: string) => void;

interface CommentFormProps {
    isAuthenticated: boolean;
    isActive: boolean;
    onSubmit: CommentSubmitFunc;
    returnUrl?: string;
}

interface CommentFormState {
    text: string;
    isValid: boolean;
}

export default class CommentForm extends React.Component<CommentFormProps, CommentFormState> {
    constructor(props: CommentFormProps) {
        super(props);

        this.state = {
            text: "",
            isValid: false
        };
    }

    validateForm(): void {
        // TODO - add validation for longer comments and add an indicator below the box showing the allowed characters left
        this.setState({
            isValid: this.state.text.length > 2
        });
    }

    private handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        e.preventDefault();

        this.setState({
            text: e.target.value
        }, this.validateForm);
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (this.state.isValid) {
            this.props.onSubmit(this.state.text);
        }
    }

    renderLoginMessage() {
        return (
            <div className="comment-form">
                to add your own comment you need to <Link to={"/login?returnUrl=" + this.props.returnUrl}>login</Link> first
            </div>
        );
    }

    renderForm() {
        const { isActive } = this.props;
        return (
            <form className="comment-form form-section" onSubmit={this.handleFormSubmit}>
                <h4>your own comment</h4>
                <div>
                    <div className="text-muted">oh, by the way - we support markdown ... and we don't tolerate spam</div>
                    <textarea className="textarea-large" disabled={isActive} onChange={this.handleContentChange} placeholder="your comment goes here ..."></textarea>
                </div>
                <div>
                    <button type="submit" className="button button-medium" disabled={!this.state.isValid || isActive}>
                        {isActive ? "Adding Comment ..." : "Add Comment"}
                    </button>
                </div>
            </form>
        );
    }

    render() {
        return this.props.isAuthenticated
            ? this.renderForm()
            : this.renderLoginMessage();
    }
}