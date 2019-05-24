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
import { valueFormatter as vf } from "powerbi-visuals-utils-formattingutils";
import IValueFormatter = vf.IValueFormatter;

export interface VisualState {
    viewport: ViewportData;
    settings: Settings;
    measures: MeasureData[];
    category: CategoryData;
    entries: DataEntry[];
}

export interface Settings {
    color?: string;
    gridEnabled?: boolean;
    tooltipEnabled?: boolean;
    isClustered?: boolean;
}

export interface ViewportData {
    width: number;
    height: number;
}

export interface MeasureData {
    displayName: string;
    index: number;
    maxValue?: number;
    minValue?: number;
    queryName?: string;
    color: string;
    formatter: IValueFormatter;
}

export interface CategoryData {
    displayName: string;
    count: number;
    displayValues: string[];
    maxWidth: number;
    formatter: IValueFormatter;
}

export interface DataPoint {
    measureIndex: number;
    value: number;
    displayValue?: string;
}

export interface DataEntry {
    sum: number;
    index: number;
    name: string;
    dataPoints: DataPoint[];
}
