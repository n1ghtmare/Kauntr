import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

interface CountdownFilterControlsProps {
    totalCount: number;
    isInFilterMode: boolean;
    onFilterModeToggle: Function;
    isAuthenticated?: boolean;
}

export default class CountdownFilterControls extends React.Component<CountdownFilterControlsProps, any> {
    private handleFilterToggleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onFilterModeToggle();
    }

    componentDidUpdate(prevProps: CountdownFilterControlsProps, prevState: any) {
        if (this.props.isInFilterMode && !prevProps.isInFilterMode) {
            const filterInput: HTMLInputElement = this.refs["filter-input"] as HTMLInputElement;
            if (filterInput) {
                filterInput.focus();
            }
        }
    }

    renderFilters() {
        if (!this.props.isInFilterMode) {
            return null;
        }

        return (
            <div>
                <input type="text" className="input input-medium input-wide" placeholder="filter by countdown title ..." ref="filter-input" />
                <div className="filter-controls">
                    <div>sub-filters:</div>
                    <ul>
                        <li>
                            <input type="checkbox" id="filter-created-by-me" />
                            <label htmlFor="filter-created-by-me">created by me</label>
                        </li>
                        <li>
                            <input type="checkbox" id="filter-include-expired" defaultChecked={true} />
                            <label htmlFor="filter-include-expired">exclude ended</label>
                        </li>
                    </ul>
                </div>
                <button className="button button-medium">filter away</button>
            </div>
        );
    }

    render() {
        const { totalCount, isInFilterMode } = this.props;
        const toggleLink = (
            <a href="#" onClick={this.handleFilterToggleClick} title="filter">
                {isInFilterMode ? "cancel" : "filter"}
            </a>
        );

        return (
            <div>
                <h3>{totalCount} {pluralizeNaive(totalCount, "countdown")} ({toggleLink})</h3>
                {this.renderFilters()}
            </div>
        );
    }
}