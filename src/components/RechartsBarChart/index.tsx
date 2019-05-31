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
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { DataEntry, MeasureData, CategoryData } from "../../dataInterfaces";
import { TooltipContent } from "../Tooltip";

import {
  TICKS_HEIGHT,
  BAR_HEIGHT,
  BAR_PADDING,
  BAR_COLOR,
  LEGEND_HEIGHT,
  LABELS_PADDING,
  CHART_PADDING,
  FONT_SIZE,
  LINE_COLOR
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
  isClustered?: boolean;
  tooltipEnabled?: boolean;
  gridEnabled?: boolean;
}

export const RechartsBarChart: React.FunctionComponent<ChartProps> = (
  props: ChartProps
) => {
  const {
    measures,
    category,
    height,
    width,
    isClustered,
    tooltipEnabled,
    gridEnabled
  } = props;

  if (!props.entries) return <div>No Entries</div>;

  const labelsWidth = category.maxWidth + LABELS_PADDING;
  const chartHeight = BAR_HEIGHT * props.entries.length;
  const chartWidth = width - labelsWidth - CHART_PADDING;

  let entries = props.entries
    .map(entry => {
      let rechartsEntry = { ...entry };
      entry.dataPoints.forEach(element => {
        rechartsEntry[`value${element.measureIndex}`] = element.value;
      });
      return rechartsEntry;
    })
    .sort((a: DataEntry, b: DataEntry) =>
      a.dataPoints[0].value < b.dataPoints[0].value
        ? 1
        : a.dataPoints[0].value > b.dataPoints[0].value
        ? -1
        : 0
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
  const scroll = height - TICKS_HEIGHT - LEGEND_HEIGHT < chartHeight;

  return (
    <div className="bar-chart">
      <div
        className="bar-chart-body"
        style={{
          height: Math.min(height - TICKS_HEIGHT - LEGEND_HEIGHT, chartHeight),
          width,
          overflowY: scroll ? "scroll" : "hidden"
        }}
      >
        <BarChart
          className="bar-chart-recharts"
          layout={"vertical"}
          height={chartHeight}
          width={width - CHART_PADDING}
          data={entries}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          {gridEnabled && (
            <CartesianGrid horizontal={false} stroke={LINE_COLOR} />
          )}
          <XAxis
            dataKey="sum"
            type="number"
            domain={[0, domainMax]}
            interval={0}
            hide={true}
            tick={{ fontSize: FONT_SIZE }}
            ticks={tickValues}
          />
          <YAxis
            dataKey="name"
            type="category"
            allowDataOverflow={true}
            width={labelsWidth}
            minTickGap={0}
            interval={0}
            tick={{
              fontSize: FONT_SIZE,
              width: labelsWidth + LABELS_PADDING * 2
            }}
            tickMargin={0}
            ticks={entries.map(entry => entry.name)}
          />
          {tooltipEnabled && (
            <Tooltip
              animationDuration={300}
              content={props => {
                if (
                  props.payload &&
                  props.payload[0] &&
                  props.payload[0].payload
                ) {
                  const dataEntry = props.payload[0].payload;

                  return (
                    dataEntry && (
                      <TooltipContent
                        measures={measures}
                        categoryTitle={category.displayName}
                        categoryValue={dataEntry.name}
                        {...dataEntry}
                      />
                    )
                  );
                }
              }}
            />
          )}
          {measures.map((measure, index) => (
            <Bar
              dataKey={`value${index}`}
              fill={measure.color}
              stackId={isClustered ? `value${index}` : "stacked"}
            />
          ))}
        </BarChart>
      </div>
      <div className="bar-chart-footer" style={{ height: TICKS_HEIGHT, width }}>
        <BarChart
          layout={"vertical"}
          height={TICKS_HEIGHT}
          width={width - CHART_PADDING}
          data={[maxEntry]}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <YAxis
            dataKey="name"
            type="category"
            allowDataOverflow={true}
            width={labelsWidth}
            tick={{ fontSize: FONT_SIZE }}
            ticks={[maxEntry.name]}
          />
          <XAxis
            dataKey="sum"
            type="number"
            domain={[0, domainMax]}
            interval={0}
            tick={{ fontSize: FONT_SIZE }}
            ticks={tickValues}
          />
        </BarChart>
      </div>
    </div>
  );
};

export default RechartsBarChart;
