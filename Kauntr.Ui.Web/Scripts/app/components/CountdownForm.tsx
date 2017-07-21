import * as React from "react";

export default class CountdownForm extends React.Component<any, any> {
    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>create a new countdown</h3>
                    <form className="form-section countdown-form">
                        <h4>what is happening?</h4>
                        <div>
                            <input type="text" className="input input-medium" placeholder="describe the event" maxLength={50} autoComplete={"off"} />
                        </div>
                        <h4>when?</h4>
                        <div>
                            <select className="input input-medium form-countdown-type">
                                <option>duration</option>
                                <option>date</option>
                            </select>
                        </div>
                        <div>
                            <input type="text" className="input input-medium form-duration" placeholder="duration" />
                            <select className="input input-medium form-duration-type">
                                <option>seconds</option>
                                <option>minutes</option>
                                <option>hours</option>
                                <option>days</option>
                                <option>months</option>
                                <option>years</option>
                            </select>
                            <div>(from now)</div>
                        </div>
                        <div>
                            <input type="text" className="input input-medium form-endson" placeholder="dd" maxLength={2} />
                            <span className="text-medium-sub">/</span>
                            <input type="text" className="input input-medium form-endson" placeholder="mm" maxLength={2} />
                            <span className="text-medium-sub">/</span>
                            <input type="text" className="input input-medium form-endson" placeholder="yyyy" maxLength={4} />
                            <span className="text-medium-sub">-</span>
                            <input type="text" className="input input-medium form-endson" placeholder="dd" maxLength={2} />
                            <span className="text-medium-sub">:</span>
                            <input type="text" className="input input-medium form-endson" placeholder="dd" maxLength={2} />
                            <div>example date: 21/7/2019 - 19:35 (time is optional)</div>
                        </div>
                        <div>
                            <button type="submit" className="button button-medium">Start</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}