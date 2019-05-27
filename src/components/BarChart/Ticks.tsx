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

export interface Tick {
    value: number;
    x: number;
    y: number;
}

export interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
    ticks: Tick[];
}

export const Ticks: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { ticks, width, height, x, y } = props;

    return (ticks &&
        <g
            className="bar-chart-ticks"
            height={height} width={width}
            >
            { ticks.map((tick) =>
                <text
                    x={tick.x + x}
                    y={tick.y + y + (height * 2) / 3}
                    >
                    {String(tick.value)}
                </text>
            )}
        </g>
    );
};
