import { DataEntry, MeasureData } from "../../dataInterfaces";
import { MouseEvent } from "react";

export interface Entry extends DataEntry {
    width?: number;
    height?: number;
    measures?: MeasureData[];
    y?: number;
    x?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}