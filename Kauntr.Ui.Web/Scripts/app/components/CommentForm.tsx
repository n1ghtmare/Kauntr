import * as React from "react";

type CommentSubmitFunc = (content: string) => void;

interface CommentFormProps {
    isActive: boolean;
    onSubmit: CommentSubmitFunc;
}

interface CommentFormState {
    content: string;
    isValid: boolean;
}

export default class CommentForm extends React.Component<CommentFormProps, CommentFormState> {
    constructor(props: CommentFormProps) {
        super(props);

        this.state = {
            content: "",
            isValid: false
        };
    }

    validateForm(): void {
        // TODO - add validation for longer comments and add an indicator below the box showing the allowed characters left
        this.setState({
            isValid: this.state.content.length > 2
        });
    }

    private handleContentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        e.preventDefault();

        this.setState({
            content: e.target.value
        }, this.validateForm);
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (this.state.isValid) {
            this.props.onSubmit(this.state.content);
        }
    }

    render() {
        const { isActive } = this.props;
        return (
            <form className="form-section" onSubmit={this.handleFormSubmit}>
                <div>
                    <textarea className="textarea-large" disabled={isActive} onChange={this.handleContentInputChange} placeholder="your comment here ..."></textarea>
                </div>
                <div>
                    <button type="submit" className="button button-medium" disabled={!this.state.isValid || isActive}>Add Comment</button>
                </div>
            </form>
        );
    }
}