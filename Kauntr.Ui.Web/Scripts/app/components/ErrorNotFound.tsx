import * as React from "react";

import Error from "./Error";

const ErrorNotFound: React.SFC = () => (
    <Error code={"404"} subMessage={"we can't find what you're looking for"}>
        <div className="text-error">
            <p>Make sure you've got the right link</p>
            <p>Contact us at <a href="mailto:support@kauntr.com">support@kauntr.com</a> if you think you've got the correct address.</p>
        </div>
    </Error>
);

export default ErrorNotFound;