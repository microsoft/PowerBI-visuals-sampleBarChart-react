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

import { DataEntry, MeasureData, CategoryData } from "../../dataInterfaces";

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
    category?: CategoryData;
    showTooltip?: (tooltipEntry: DataEntry) => void;
    hideTooltip?: () => void;
}

export const BarChart: React.FunctionComponent<ChartProps> = (
    props: ChartProps
) => {
    const {
        measures,
        category,
        height,
        width,
        showTooltip,
        hideTooltip
    } = props;

    if (!props.entries) return <div>No Entries</div>;

    console.warn("category.maxWidth", category.maxWidth);

    const labelsWidth = category.maxWidth + LABELS_PADDING;
    const chartHeight = BAR_HEIGHT * props.entries.length;
    const chartWidth = width - labelsWidth - CHART_PADDING;

    let entries = props.entries.sort((a: DataEntry, b: DataEntry) =>
        a.dataPoints[0].value < b.dataPoints[0].value
        ? 1
        : ( a.dataPoints[0].value > b.dataPoints[0].value
            ? -1
            : 0
        )
    );

    const maxEntry = entries.reduce(
        (acc, v) => (acc.sum > v.sum ? acc : v),
        entries[0]
    );
    const domainMax: number = maxEntry.sum;

    const calculateTicks = (entries, domainMax) => {
        const pow = String(Math.floor(domainMax)).length - 1;
        const ticksCount = 1 + Number(String(Math.floor(domainMax))[0]);
        const ticks = [];

        for (let i = 0; i < ticksCount; i++) {
            ticks.push(i * Math.pow(10, pow));
        }

        return ticks;
    };

    const tickValues = calculateTicks(entries, domainMax);

    const lines = tickValues.map(value => ({
        value,
        y: 0,
        x: chartWidth * (value / domainMax)
    }));

    const ticks = tickValues.map(value => ({
        value,
        y: 0,
        x: chartWidth * (value / domainMax)
    }));

    return (
        <div className="bar-chart">
            <div
                className="bar-chart-body"
                style={{ height: height - TICKS_HEIGHT - LEGEND_HEIGHT, width }}
            >
                <svg height={chartHeight} width={width}>
                    <Grid
                        x={labelsWidth}
                        y={0}
                        height={chartHeight}
                        width={width}
                        lines={lines}
                    />
                    <Bars
                        entries={entries}
                        measures={measures}
                        width={chartWidth}
                        height={chartHeight}
                        x={labelsWidth}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                    <Labels
                        x={0}
                        y={0}
                        entries={entries}
                        width={labelsWidth}
                        height={chartHeight}
                    />
                </svg>
            </div>
            <div
                className="bar-chart-footer"
                style={{ height: TICKS_HEIGHT, width }}
            >
                <svg
                    height={TICKS_HEIGHT}
                    width={width}
                >
                    <Ticks
                        height={TICKS_HEIGHT}
                        width={width}
                        ticks={ticks}
                        x={labelsWidth}
                        y={0}
                    />
                </svg>
            </div>
        </div>
    );
};
