import * as React from "react";
import * as classNames from "classnames";

import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

interface CommentOrderControlsProps {
    itemsTotalCount: number;
    onChange: (displayOrder: CommentDisplayOrderType) => void;
    displayOrderType: CommentDisplayOrderType;
}

export default class CommentOrderControls extends React.Component<CommentOrderControlsProps, any> {
    private handleDisplayOrderClick = (e: React.MouseEvent<HTMLAnchorElement>, displayOrderType: CommentDisplayOrderType) => {
        e.preventDefault();
        this.props.onChange(displayOrderType);
    }

    render() {
        if (this.props.itemsTotalCount < 3) {
            return null;
        }

        const { displayOrderType } = this.props;
        const items = Object.keys(CommentDisplayOrderType)
            .map(x => parseInt(x))
            .filter(x => !isNaN(x))
            .map(x =>
                <li className={classNames({ "active": x === displayOrderType })} key={x}>
                    <a onClick={(e) => this.handleDisplayOrderClick(e, x)} href="#" title={CommentDisplayOrderType[x]}>{CommentDisplayOrderType[x].toLowerCase()}</a>
                </li>
            );

        return (
            <div className="comments-order-controls">
                <div>display order:</div>
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}