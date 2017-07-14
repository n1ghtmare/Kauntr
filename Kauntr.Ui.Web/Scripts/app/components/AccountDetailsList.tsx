import * as React from "react";
import * as moment from "moment";

interface AccountDetailsListProps {
    email: string;
    createdOn: moment.Moment;
    reputation: number;
}

const AccountDetailsList: React.SFC<AccountDetailsListProps> = (props) => {
    const { createdOn } = props;
    return (
        <ul>
            <li>email - {props.email}</li>
            <li>joined - {typeof createdOn !== "undefined" ? createdOn.fromNow() : "-"}</li>
            <li>reputation - {props.reputation}</li>
        </ul>
    );
};

export default AccountDetailsList;