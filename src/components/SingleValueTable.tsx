import * as React from "react";

export interface Entry {
    name: string | number;
    value: string | number;
}

export interface Props {
    style?: React.CSSProperties;
    categoryTitle: string;
    measureTitle: string;
    entries: Entry[];
}

export const SingleValueTable: React.FunctionComponent<Props> = (
    props: Props
) => (
    <table className="tableView" style={props.style}>
        <thead>
        <tr>
            <th>{ props.categoryTitle }</th>
            <th>{ props.measureTitle }</th>
        </tr>
        </thead>
        <tbody>
            { props.entries &&
            props.entries.map((entry: Entry) => 
                <tr>
                <td>{ entry.name }</td>
                <td>{ entry.value }</td>
                </tr>
            )
            }
        </tbody>
    </table>
);

