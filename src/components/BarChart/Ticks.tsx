import * as React from "react";

export interface Tick {
    value: number;
    x: number;
    y: number;
}

export interface Props {
    width: number;
    height: number;
    ticks: Tick[];
}

export const Ticks: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { ticks, width, height } = props;

    return (ticks &&
        <g 
            className="bar-chart-ticks"
            height={height} width={width}
            >
            { ticks.map((tick) => 
                <text
                    x={tick.x}
                    y={tick.y}
                    >
                    {tick.value}
                </text>   
            )}
        </g>
    );
}