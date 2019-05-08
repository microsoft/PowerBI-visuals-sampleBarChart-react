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

import { DataEntry, MeasureData } from "../../dataInterfaces";

import { 
    TICKS_HEIGHT,
    BAR_HEIGHT,
    BAR_PADDING,
    BAR_COLOR,
    LEGEND_HEIGHT,
    LABELS_PADDING,
    CHART_PADDING
} from "../../constants";

export interface Entry extends DataEntry {
    width?: number;
    height?: number;
    y: number; 
}

export interface ChartProps {
    width?: number;
    height?: number;
    entries?: DataEntry[];
    measures?: MeasureData[];
    showTooltip?: (tooltipEntry: DataEntry, x: number, y: number) => void;
    hideTooltip?: () => void;
}

export const BarChart: React.FunctionComponent<ChartProps> = (
    props: ChartProps
) => {
    const { measures, height, width, showTooltip, hideTooltip } = props;

    if (!props.entries) return (<div>No Entries</div>);

    const labelsWidth = width*.2 + LABELS_PADDING;
    const chartHeight = BAR_HEIGHT * props.entries.length;
    const chartWidth = width - labelsWidth;

    let entries = props.entries.sort(
        (a: DataEntry, b: DataEntry) => (
            a.dataPoints[0].value < b.dataPoints[0].value) 
            ? 1 
            : (a.dataPoints[0].value > b.dataPoints[0].value 
                ? -1 
                : 0
            )
        );
    
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
                        entries={ entries }
                        measures={ measures } 
                        width={ chartWidth - CHART_PADDING }
                        height={ chartHeight }
                        x={ labelsWidth }
                        showTooltip={ showTooltip }
                        hideTooltip={ hideTooltip }
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