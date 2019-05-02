import * as React from "react";

const LINE_COLOR = "#777777";

export interface Line {
    value: number;
    x: number;
    y: number;
}

export interface Props {
    width: number;
    height: number;
    lines: Line[];
}

export const Grid: React.FunctionComponent<Props> = (
    props: Props
) => {
    const { lines, width, height } = props;

    return (lines &&
        <g 
            className="bar-chart-lines"
            height={height} width={width}
            >
            { lines.map((tick) => 
                <line
                    x1={0}
                    x2={height}
                    y1={tick.y}
                    y2={tick.y}
                    stroke={LINE_COLOR}
                />  
            )}
        </g>
    );
}