import * as React from "react";

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

export const Labels: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { entries, width, height, x, y } = props;

    return (
    <g 
        className="bar-chart-labels"
        height={height}
        width={width}
        x={x || 0}
        y={y || 0}
        >
        {   entries.map((entry) =>
                <text
                    x={0}
                    y={entry.y + entry.height}
                    fontSize={entry.height}
                    >
                    {entry.name}
                </text>
            )
        }
    </g>
    );
}