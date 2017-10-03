import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

interface CountdownFilterControlsProps {
    totalCount: number;
    isAuthenticated?: boolean;
}

interface CountdownFilterControlsState {
    isInFilterMode: boolean;
}

export default class CountdownFilterControls extends React.Component<CountdownFilterControlsProps, CountdownFilterControlsState> {
    constructor(props: CountdownFilterControlsProps) {
        super(props);

        // TODO - Toggle into the Redux store rather than the local state (should persist between component re-renders)
        this.state = {
            isInFilterMode: false
        };
    }

    renderFilters() {
        if (!this.state.isInFilterMode) {
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
                            <input type="checkbox" id="filter-include-expired" />
                            <label htmlFor="filter-include-expired">include expired</label>
                        </li>
                    </ul>
                </div>
                <button className="button button-medium">filter away</button>
            </div>
        );
    }

    filterInputFocusToggle(): void {
        const filterInput: HTMLInputElement = this.refs["filter-input"] as HTMLInputElement;
        if (filterInput) {
            filterInput.focus();
        }
    };

    private handleFilterToggleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();

        this.setState({
            isInFilterMode: !this.state.isInFilterMode
        }, this.filterInputFocusToggle);
    }

    render() {
        const { totalCount } = this.props;
        const { isInFilterMode } = this.state;

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