import * as React from "react";

const BAR_COLOR = '#5555FF';
export interface Entry {
    name: string | number;
    value: number;
    width: number;
    height: number;
    y: number;
}

export interface Props {
    x?: number;
    y?: number;
    width: number;
    height: number;
    entries: Entry[];
}

export const Bars: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { entries, width, height, x, y } = props;

    return (
    <g 
        className="bar-chart-bars"
        height={height}
        width={width}
        x={x || 0}
        y={y || 0}
    >
        {  entries.map((entry) => 
            <rect 
                onClick={() => console.warn("BEEP", entry)}
                width={entry.width}
                height={entry.height}
                y={entry.y}
                x={x || 0}
                fill={BAR_COLOR}
            />
            )
        }
    </g>
    );
}