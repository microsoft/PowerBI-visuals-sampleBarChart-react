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
import { DataEntry, MeasureData, DataPoint } from "../dataInterfaces";

import { TOOLTIP_OFFSET_X, TOOLTIP_OFFSET_Y } from "../constants";

import { Measure, MeasureProps } from "./Measure";

export interface State {
    x: number;
    y: number;
}

export interface Entry {
    name: string | number;
    value: string | number;
}

export interface Props extends DataEntry {
    style?: React.CSSProperties;
    categoryTitle: string;
    categoryValue: string;
    measures: MeasureData[];
}

export class Tooltip extends React.Component<Props, State> {
    public static initialState: State = { x: 0, y: 0 };

    constructor(props: Props) {
        super(props);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    }

    public state: State = Tooltip.initialState;

    componentWillMount() {
        document.addEventListener("mousemove", this.mouseMoveHandler);
    }

    mouseMoveHandler(e: any) {
        this.setState({ x: e.pageX, y: e.pageY });
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    render() {
        const {
            measures
        } = this.props;

        const { x, y } = this.state;

        return (
            measures && (
                <div
                    className="tooltip"
                    style={{
                        top: y + TOOLTIP_OFFSET_Y,
                        left: x + TOOLTIP_OFFSET_X
                    }}
                >
                <TooltipContent
                    {...this.props}
                />
            </div>
            )
        );
    }
}

export const TooltipContent: React.FunctionComponent<Props> = (props: Props) => {
    const {categoryTitle, categoryValue, measures, dataPoints } = props;
    return (
        <div className="tooltip-content">
            <dl>
                <dt>{categoryTitle}:</dt>
                <dd>{categoryValue}</dd>
            </dl>
            {dataPoints.map((dataPoint: DataPoint) => (
                <dl>
                    <dt>
                        <Measure
                            {...measures[dataPoint.measureIndex]}
                        />
                    </dt>
                    <dd>{dataPoint.displayValue}</dd>
                </dl>
            ))}
        </div>
    );
}
