import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link } from "react-router";
import { connect } from "react-redux";
import * as classNames from "classnames";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class Header extends React.Component<SharedContextState, any> {
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

    renderMenu() {
        const isAuthenticated: boolean = this.props.currentUserAccountId !== null;
        const { notificationsCount } = this.props;

        return (
            <div className="row">
                <div className="fivecol first">
                    <div id="header-logo">kauntr // {this.props.title}</div>
                </div>
                <div className="sevencol last">
                    <ul id="header-menu">
                        <li className={classNames({ "hidden": notificationsCount === 0 })}><Link to="/notifications" className="notifications-indicator">{notificationsCount}</Link></li>
                        <li className={classNames({ "hidden": isAuthenticated })}><Link to="/login">login</Link></li>
                        <li className={classNames({ "hidden": !isAuthenticated })}>
                            <a className="has-sub-menu" href="#">account</a>
                            <ul className="sub-menu">
                                <li><Link to="/account">settings</Link></li>
                                <li><Link to="/logout">logout</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/countdowns">countdowns</Link></li>
                        <li className={classNames({ "hidden": !isAuthenticated })}><Link to="/countdown/create" className="menu-link-special">+</Link></li>
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div id="header">
                <div className="container">
                    {this.renderMenu()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): SharedContextState {
    return state.sharedContext;
}

export default connect(mapStateToProps, null)(Header);