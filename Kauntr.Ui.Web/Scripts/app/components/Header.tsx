import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";

export default class Header extends React.Component<any, any> {
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
        if(this.state.isInSearchMode && !prevState.isInSearchMode) {
            this.searchInput.focus();
        }
    }

    private searchInput: HTMLInputElement;

    private handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.setState({isInSearchMode: !this.state.isInSearchMode, searchQuery: ""});
    }

    render() {
        return (
            <div id="header">
                <div className={classNames({"hidden": !this.state.isInSearchMode})}>
                    <input type="text" className="search-query" value={this.state.searchQuery} onChange={(e) => this.setState({searchQuery: e.target.value})} ref={(input) => this.searchInput = input } />
                </div>
                <div id="notifications-live" className="text-small">
                    <a className="underlined-link" href="#">Dimitar Dimitrov and 15 others commented on your countdown</a> - about a minute ago <a id="notifications-live-close-link" className="pull-right" href="#"><i className="fa fa-times"></i></a>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="threecol">
                            <div id="header-logo">kauntr // @title</div>
                        </div>
                        <div className="ninecol last">
                            <ul id="header-menu">
                                <li>
                                    <a id="notifications-indicator" href="#">12</a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.handleSearchClick}>search</a>
                                </li>
                                <li><a href="#">login</a></li>
                                <li>
                                    <a className="has-sub-menu" href="#">account</a>
                                    <ul className="sub-menu">
                                        <li><a href="#">settings</a></li>
                                        <li><a id="logoff-link" href="#">logoff</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a className="has-sub-menu" href="#">countdowns</a>
                                    <ul className="sub-menu">
                                        <li><a href="#">Latest</a></li>
                                        <li><a href="#">Trending</a></li>
                                        <li><a href="#">Mine</a></li>
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