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
import { getStringLength } from "../../helpers";

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
  legendHeight?: number;
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

  const labelsWidth: number = category.maxWidth + LABELS_PADDING;
  const chartHeight: number = BAR_HEIGHT * props.entries.length;

  const legendHeight: number = props.legendHeight || LEGEND_HEIGHT;
  //(measures.length < 5) ? LEGEND_HEIGHT : 16*Math.floor(measures.length / 2); //TODO GOOD

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
  const domainMax: number = Math.max(maxEntry.sum, 0);

  const minEntry = entries.reduce(
    (acc, v) => (acc.sum < v.sum ? acc : v),
    entries[0]
  );

  const domainMin: number = Math.min(minEntry.sum, 0);
  const domain: number[] = [domainMin, domainMax];

  const calculateTicks = (domainMax: number, domainMin: number) => {
    const pow = String(
      Math.floor( Math.max( Math.abs(domainMax), Math.abs(domainMin) ) )
    ).length - 1;

    const positiveTicksCount = 1 + Number(String(Math.floor(domainMax))[0]);
    const negativeTicksCount = (domainMin < 0) ? Number(String(Math.floor(Math.abs(domainMin)))[0]) : 0;

    const ticksPerTen = (positiveTicksCount + negativeTicksCount < 5) ? 2 : 1;

    const ticks = [];

    if (domainMin < 0) {
      for (let i = negativeTicksCount; i > 0; i--) {
        ticks.push(-i * Math.pow(10, pow));
        if (ticksPerTen === 2) {
          ticks.push(-(i + .5) * Math.pow(10, pow));
        }
      }
    }

    for (let i = 0; i < positiveTicksCount; i++) {
      ticks.push(i * Math.pow(10, pow));
      if (ticksPerTen === 2) {
        ticks.push((i + .5) * Math.pow(10, pow));
      }
    }

    return ticks;
  };

  let tickValues: number[] = calculateTicks(domainMax, domainMin);

  const scroll: boolean = height - TICKS_HEIGHT - legendHeight < chartHeight;
  const chartWidth: number = width - CHART_PADDING;

  const tickWidth: number = chartWidth/ tickValues.length;
  const largestTick: string = tickValues.reduce( (acc, value) => value.toString().length > acc.length ? value.toString() : acc, '');

  if (tickWidth < getStringLength(largestTick )) {
    tickValues = tickValues.filter((value, index) => (!(index % 2)) ); //TODO GOOD
  }

  return (
    <div className="bar-chart">
      <div
        className="bar-chart-body"
        style={{
          height: Math.min(height - TICKS_HEIGHT - legendHeight, chartHeight),
          maxHeight: Math.min(height - TICKS_HEIGHT - legendHeight, chartHeight),
          width,
          overflowY: scroll ? "scroll" : "hidden",
          position: "relative",
        }}
      >
        <div
        style={{
          overflow: "hidden",
          maxHeight: chartHeight,
          height: chartHeight,
          position: "relative",
          width: chartWidth
        }}
        >
          <BarChart
            className="bar-chart-recharts"
            layout={"vertical"}
            height={chartHeight}
            width={chartWidth}
            data={entries}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            {gridEnabled && (
              <CartesianGrid
                horizontal={false}
                stroke={LINE_COLOR}
                // horizontalPoints={tickValues}
                // verticalPoints={tickValues.map( (i) => { console.log(i); return ( chartWidth * ( i / domainMax)); })}
              />
            )}
            <XAxis
              dataKey="sum"
              type="number"
              domain={[domainMin, domainMax]}
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
                animationDuration={0}
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
            domain={[domainMin, domainMax]}
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
