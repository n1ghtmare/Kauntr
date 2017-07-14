import * as React from "react";
import * as moment from "moment";

import AccountDetailsList from "./AccountDetailsList";
import DiamondsSeparator from "./DiamondsSeparator";

export default class AccountDetails extends React.Component<any, any> {
    render() {
        return (
            <div className="main-section animated fadeIn">
                <h1 className="main-section-header">Account (some dude)</h1>
                <AccountDetailsList createdOn={moment()} email={"some@dude.com"} reputation={17589} />
                <DiamondsSeparator />
            </div>
        );
    }
}