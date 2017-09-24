import * as moment from "moment";

export function parseRawDate(rawDate: string): moment.Moment {
    if (rawDate.indexOf("/Date(") === 0) {
        let dateSegment = parseInt(rawDate.substring(6));
        return moment(dateSegment).utc(true);
    }
    return moment(rawDate);
}