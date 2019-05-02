import * as React from "react";
import { Bars } from "./Bars";
import { Grid } from "./Grid";
import { Ticks } from "./Ticks";
import { Labels } from "./Labels";

const BAR_COLOR = '#5555FF';
const TICKS_HEIGHT = 20;
const BAR_HEIGHT = 20;
const BAR_PADDING = 2;

export interface Entry {
    name: string | number;
    value: number;
}

export interface Props {
    width: number;
    height: number;
    maxValue: number;
    minValue: number;
    categoryTitle: string;
    measureTitle: string;
    entries: Entry[];
}

export const BarChart: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { maxValue, width, height } = props;

    if (!props.entries) return (<div>No Entries</div>);

    const labelsWidth = width*.2;
    const chartHeight = BAR_HEIGHT * props.entries.length;
    const chartWidth = width - labelsWidth;

    let entries = props.entries.sort(
        (a, b) => (a.value < b.value) ? 1 : (a.value > b.value ? -1 : 0)
    ).map((entry: Entry, index) => ({
        ...entry,
        width: (entry.value / maxValue) * chartWidth,
        height: BAR_HEIGHT - BAR_PADDING,
        y: ( chartHeight / props.entries.length) * index
    }));
    
    return (
        <div className="bar-chart"> 
            <div
                className="bar-chart-body" 
                style={{ height, width }} 
                >
                <svg
                    height={chartHeight} 
                    width={width}
                >
                    <Bars
                        entries={ entries } 
                        width={ chartWidth }
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