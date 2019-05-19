/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
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

