import * as React from "react";
import * as classNames from "classnames";

type PageChangeFunc = (page: number) => void;

interface PaginationProps {
    itemsTotalCount: number;
    pageSize: number; // items per page
    page: number; // current page
    pageListSize?: number; // number of page buttons to be listed in the pagination list
    onPageChange: PageChangeFunc;
    className?: string;
}

export default class Pagination extends React.Component<PaginationProps, any> {
    public static defaultProps: Partial<PaginationProps> = {
        className: "pagination text-medium",
        pageListSize: 7
    };

    private handlePageChange = (pageNumber: number, e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onPageChange(pageNumber);
    }

    renderLinks(startRange: number, endRange: number, currentPage: number): JSX.Element[] {
        let links: JSX.Element[] = [];
        for (let i: number = startRange; i <= endRange; i++) {
            const sr: JSX.Element = i === currentPage ? (<span className="sr-only">(current)</span>) : null;
            links.push(
                <li key={i} className={classNames({ "active": i === currentPage })}>
                    <a href="#" onClick={this.handlePageChange.bind(this, i)} className={classNames({ "disabled": i === currentPage })}>{i} {sr}</a>
                </li>
            );
        }
        return links;
    }

    renderStartLinks(currentPage: number, startRange: number): JSX.Element[] {
        let links: JSX.Element[] = [];
        if (currentPage > 1) {
            links.push(<li key="s_1"><a href="#" onClick={this.handlePageChange.bind(this, currentPage - 1)} title="Previous" data-togle="tooltip">&lsaquo;</a></li>);
        }

        if (startRange === 1) {
            return links;
        }

        links.push(<li key="s_2"><a href="#" onClick={this.handlePageChange.bind(this, 1)} title="First" data-toggle="tooltip">{1}</a></li>);
        links.push(<li key="s_3" className="disabled"><a onClick={(e) => e.preventDefault()} className="disabled" href="#" >...</a></li>);
        return links;
    }

    renderEndLinks(currentPage: number, endRange: number, totalPages: number): JSX.Element[] {
        let links: JSX.Element[] = [];
        if (currentPage < totalPages) {
            links.push(
                <li key="e_1"><a href="#" onClick={this.handlePageChange.bind(this, currentPage + 1)} title="Next" data-toggle="tooltip">&rsaquo;</a></li>
            );
        }

        if (endRange === totalPages) {
            return links;
        }

        links.unshift(<li key="e_3"><a href="#" onClick={this.handlePageChange.bind(this, totalPages)} title="Last" data-toggle="tooltip">{totalPages}</a></li>);
        links.unshift(<li key="e_2" className="disabled"><a onClick={(e) => e.preventDefault()} href="#" className="disabled">...</a></li>);
        return links;
    }

    render() {
        const totalPages: number = Math.ceil(this.props.itemsTotalCount / this.props.pageSize);

        if (totalPages <= 1) {
            return null;
        }

        const { page, pageListSize } = this.props;
        const mid: number = Math.floor(pageListSize / 2);
        let startRange: number = page - mid;
        let endRange: number = page + mid;

        if (startRange <= 2) {
            startRange = 1;
            endRange = startRange + (mid * 2);
            endRange = endRange > totalPages - 1 ? totalPages : endRange;
        }
        else if (endRange >= totalPages - 1) {
            endRange = totalPages;
            startRange = endRange - (mid * 2);
            startRange = startRange < 1 ? 1 : startRange;
        }

        return (
            <nav>
                <ul className={this.props.className}>
                    {this.renderStartLinks(page, startRange)}
                    {this.renderLinks(startRange, endRange, page)}
                    {this.renderEndLinks(page, endRange, totalPages)}
                </ul>
            </nav>
        );
    }
}