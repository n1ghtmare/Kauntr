import * as React from "react";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

interface CountdownFilterControlsProps {
    query: string;
    isCurrentlyActive: boolean;
    isCreatedByCurrentUser: boolean;
    totalCount: number;
    isInFilterMode: boolean;
    onFilterModeToggle: Function;
    onFilterChange: (query: string, isCurrentlyActive: boolean, isCreatedByCurrentUser: boolean) => void;
    isAuthenticated: boolean;
    totalCreationsFromServer: number;
}

interface CountdownFilterControlsState {
    query: string;
    isCurrentlyActive: boolean;
    isCreatedByCurrentUser: boolean;
}

export default class CountdownFilterControls extends React.Component<CountdownFilterControlsProps, CountdownFilterControlsState> {
    constructor(props: CountdownFilterControlsProps) {
        super(props);

        this.state = {
            query: props.query === null ? "" : props.query,
            isCurrentlyActive: props.isCurrentlyActive,
            isCreatedByCurrentUser: props.isCreatedByCurrentUser
        };
    }

    private handleFilterToggleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onFilterModeToggle();
    }

    private handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => this.setState({ query: e.target.value });

    private handleCreatedByCurrentUserChange = (e: React.ChangeEvent<HTMLInputElement>): void => this.setState({ isCreatedByCurrentUser: e.target.checked });

    private handleCurrentlyActiveChange = (e: React.ChangeEvent<HTMLInputElement>): void => this.setState({ isCurrentlyActive: e.target.checked });

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.props.onFilterChange(this.state.query, this.state.isCurrentlyActive, this.state.isCreatedByCurrentUser);
    }

    private handleRefreshClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onFilterChange(this.state.query, this.state.isCurrentlyActive, this.state.isCreatedByCurrentUser);
    }

    componentDidUpdate(prevProps: CountdownFilterControlsProps, prevState: any) {
        if (this.props.isInFilterMode && !prevProps.isInFilterMode) {
            const filterInput: HTMLInputElement = this.refs["filter-query"] as HTMLInputElement;
            if (filterInput) {
                filterInput.focus();
            }
        }
        // TODO - cancel filter (reset to default) * perhaps in another lifecycle event (componentWillUpdate?)
    }

    renderFiltersForm() {
        if (!this.props.isInFilterMode) {
            return null;
        }

        const createdByFilter = this.props.isAuthenticated
            ? (
                <li>
                    <input type="checkbox" id="filter-created-by-me" checked={this.state.isCreatedByCurrentUser} onChange={this.handleCreatedByCurrentUserChange} />
                    <label htmlFor="filter-created-by-me">created by me</label>
                </li>
            )
            : null;

        return (
            <form className="form-section" onSubmit={this.handleFormSubmit}>
                <input type="text" className="input input-medium input-wide" placeholder="filter by countdown title ..." ref="filter-query" value={this.state.query} onChange={this.handleQueryChange} />
                <div className="filter-controls">
                    <div>sub-filters:</div>
                    <ul>
                        <li>
                            <input type="checkbox" id="filter-currently-active" checked={this.state.isCurrentlyActive} onChange={this.handleCurrentlyActiveChange} />
                            <label htmlFor="filter-currently-active">currently active</label>
                        </li>
                        {createdByFilter}
                    </ul>
                </div>
                <button className="button button-medium">filter away</button>
            </form>
        );
    }

    renderUpdatesIndicator() {
        const { totalCreationsFromServer } = this.props;
        return totalCreationsFromServer === 0
            ? null
            : (
                <span className="muted">
                    - <a href="#" onClick={this.handleRefreshClick} title="refresh">
                        (has {totalCreationsFromServer} {pluralizeNaive(totalCreationsFromServer, "update")})
                    </a>
                </span>
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
                <h3>{totalCount} {pluralizeNaive(totalCount, "countdown")} ({toggleLink}) {this.renderUpdatesIndicator()}</h3>
                {this.renderFiltersForm()}
            </div>
        );
    }
}