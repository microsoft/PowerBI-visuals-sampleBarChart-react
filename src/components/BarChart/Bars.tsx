
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

import { BAR_COLOR } from "../../constants";
import { DataEntry, MeasureData } from "../../dataInterfaces";

import { Entry } from "./types";

export interface Props {
    x?: number;
    y?: number;
    width: number;
    height: number;
    entries: Entry[];
    measures: MeasureData[];
    showTooltip?: (tooltipEntry: DataEntry, x: number, y: number) => void;
    hideTooltip?: () => void;
}

export const Bars: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { entries, width, height, x, y, measures, showTooltip, hideTooltip } = props;
    console.log('Bars', entries, width, height, x, y);
    
    return (
    <g 
        className="bar-chart-bars"
        height={height}
        width={width}
        x={x || 0}
        y={y || 0}
    >
        {entries.map(
            (entry, index) => (<ClusteredEntry 
                { ...entry } 
                onMouseEnter={() => showTooltip(entry, (x || 0), (y || 0) + (height / entries.length) * index)}
                onMouseLeave={hideTooltip}
                x={x || 0}
                y={(y || 0) + (height / entries.length) * index}
                width={width}
                height={height / entries.length}
                measures={measures} 
            />)
        )}
    </g>
    );
}

const ClusteredEntry: React.FunctionComponent<Entry> = (
    props: Entry
) => {
    const { dataPoints, sum, measures, width, height, y, x, onMouseEnter, onMouseLeave } = props;
    return (
        <g
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
        > 
            {dataPoints.map(
                (dataPoint, index) => 
                <rect 
                    width={(dataPoint.value / measures.reduce((acc, v) => acc + v.maxValue, 0)) * width }
                    height={height / dataPoints.length }
                    y={y + (height / dataPoints.length) * index}
                    x={x || 0}
                    fill={measures[dataPoint.measureIndex].color || BAR_COLOR}
                />
            )}
        </g>
    )
}

const StackedEntry: React.FunctionComponent<Entry> = (
    props: Entry
) => {
    const { dataPoints, sum, measures, width, height, y, x } = props;
    return (
        <g> 
            {dataPoints.map(
                (dataPoint, index) => 
                <rect 
                    width={(dataPoint.value / sum) * width }
                    height={height / dataPoints.length }
                    y={y + (height / dataPoints.length) * index}
                    x={x || 0}
                    fill={measures[dataPoint.measureIndex].color || BAR_COLOR}
                />
            )}
        </g>
    )
}