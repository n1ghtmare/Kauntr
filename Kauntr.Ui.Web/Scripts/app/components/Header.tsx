import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link } from "react-router";
import { connect } from "react-redux";
import * as classNames from "classnames";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class Header extends React.Component<SharedContextState, any> {
    constructor() {
        super();

        this.state = {
            isInSearchMode: false,
            searchQuery: ""
        };
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).find(".has-sub-menu").click(function (e) {
            $(this).next(".sub-menu").slideToggle(300);
            e.preventDefault();
            e.stopPropagation();
        });

        $("html").click(function () {
            let subMenu = $(".sub-menu");
            if (subMenu.is(":visible")) {
                subMenu.slideUp();
            }
        });
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.state.isInSearchMode && !prevState.isInSearchMode) {
            this.searchInput.focus();
        }
    }

    private searchInput: HTMLInputElement;

    private handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.setState({ isInSearchMode: !this.state.isInSearchMode, searchQuery: "" });
    }

    render() {
        let isAuthenticated: boolean = this.props.currentUserId !== null;
        return (
            <div id="header">
                <div className={classNames({ "hidden": !this.state.isInSearchMode })}>
                    <input type="text" className="search-query" value={this.state.searchQuery} onChange={(e) => this.setState({ searchQuery: e.target.value })} ref={(input) => this.searchInput = input} />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="threecol">
                            <div id="header-logo">kauntr // {this.props.title}</div>
                        </div>
                        <div className="ninecol last">
                            <ul id="header-menu">
                                <li><Link to="/notifications" className="notifications-indicator">13</Link></li>
                                <li><a href="#" onClick={this.handleSearchClick}>search</a></li>
                                <li><Link to="/login">login</Link></li>
                                <li className={classNames({"hidden": !isAuthenticated})}>
                                    <a className="has-sub-menu" href="#">account</a>
                                    <ul className="sub-menu">
                                        <li><Link to="/account">settings</Link></li>
                                        <li><Link to="/account/logoff">logoff</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <a className="has-sub-menu" href="#">countdowns</a>
                                    <ul className="sub-menu">
                                        <li><Link to="/countdowns/latest">Latest</Link></li>
                                        <li><Link to="/countdowns/trending">Trending</Link></li>
                                        <li className={classNames({"hidden": !isAuthenticated})}><Link to="/countdowns/mine">Mine</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): SharedContextState {
    return state.sharedContext;
};

export default connect(mapStateToProps)(Header);