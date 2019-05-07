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
import { Bars } from "./Bars";
import { Grid } from "./Grid";
import { Ticks } from "./Ticks";
import { Labels } from "./Labels";

import { 
    TICKS_HEIGHT,
    BAR_HEIGHT,
    BAR_PADDING,
    BAR_COLOR,
    LEGEND_HEIGHT,
    LABELS_PADDING,
    CHART_PADDING
} from "../../constants";

export interface Entry {
    name: string | number;
    value: number;
}

export interface Props {
    width: number;
    height: number;
    color?: string;
    maxValue: number;
    minValue: number;
    categoryTitle: string;
    measureTitle: string;
    entries: Entry[];
}

export const BarChart: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { maxValue, height, width, color } = props;

    if (!props.entries) return (<div>No Entries</div>);

    const labelsWidth = width*.2 + LABELS_PADDING;
    const chartHeight = BAR_HEIGHT * props.entries.length;
    const chartWidth = width - labelsWidth;

    let entries = props.entries.sort(
        (a, b) => (a.value < b.value) ? 1 : (a.value > b.value ? -1 : 0)
    ).map((entry: Entry, index) => ({
        ...entry,
        width: (entry.value / maxValue) * (chartWidth - CHART_PADDING),
        height: BAR_HEIGHT - BAR_PADDING,
        y: ( chartHeight / props.entries.length) * index
    }));
    
    return (
        <div className="bar-chart"> 
            <div
                className="bar-chart-body" 
                style={{ height: height  - LEGEND_HEIGHT, width }} 
            >
                <svg
                    height={chartHeight} 
                    width={width}
                >
                    <Bars
                        color={ color }
                        entries={ entries } 
                        width={ chartWidth - CHART_PADDING }
                        height={ chartHeight }
                        x={ labelsWidth }
                    />
                    <Labels
                        entries={ entries }
                        width={ labelsWidth }
                        height={ chartHeight }
                    />
                    <Grid
                        height={chartHeight} 
                        width={width} 
                        lines={[]} 
                    />
                </svg>
            </div>
            <div
                className="bar-chart-footer" 
                style={{ height: TICKS_HEIGHT, width }}
                >
                <svg>
                    <Ticks 
                        height={TICKS_HEIGHT} 
                        width={width} 
                        ticks={[]} 
                    />
                </svg>
            </div>
        </div>
    );
}