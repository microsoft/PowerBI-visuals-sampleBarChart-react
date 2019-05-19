import * as React from "react";

export interface MeasureProps {
    name?: string;
    displayName: string;
    color: string;
}


export const Measure: React.FunctionComponent<MeasureProps> = (
    props: MeasureProps
) => {
    const { displayName, color } = props;

    return (
        <span className="measure-item">
            <span
                className="measure-color"
                style={{ background: color }}
            />
            <span className="measure-text">
                {displayName}
            </span>
        </span>
    );
};

export default Measure;
