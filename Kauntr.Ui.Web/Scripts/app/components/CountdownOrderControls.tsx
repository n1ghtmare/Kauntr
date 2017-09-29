import * as React from "react";
import * as classNames from "classnames";

import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

interface CountdownOrderControlsProps {
    itemsTotalCount: number;
    onChange: (displayOrder: CountdownDisplayOrderType) => void;
    displayOrderType: CountdownDisplayOrderType;
}

export default class CountdownOrderControls<T> extends React.Component<CountdownOrderControlsProps, any> {
    private handleDisplayOrderClick = (e: React.MouseEvent<HTMLAnchorElement>, displayOrderType: CountdownDisplayOrderType) => {
        e.preventDefault();
        this.props.onChange(displayOrderType);
    }

    render() {
        if (this.props.itemsTotalCount < 3) {
            return null;
        }

        const { displayOrderType } = this.props;
        const items = Object.keys(CountdownDisplayOrderType)
            .map(x => parseInt(x))
            .filter(x => !isNaN(x))
            .map(x => {
                const title: string = CountdownDisplayOrderType[x].replace(/([A-Z])/g, " $1").trim();
                return (
                    <li className={classNames({ "active": x === displayOrderType })} key={x}>
                        <a onClick={(e) => this.handleDisplayOrderClick(e, x)} href="#" title={title}>{title.toLowerCase()}</a>
                    </li>
                );
            });

        return (
            <div className="order-controls">
                <div>display order:</div>
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
}