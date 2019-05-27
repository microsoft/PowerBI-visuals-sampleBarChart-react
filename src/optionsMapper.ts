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
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;
import DataViewValueColumns = powerbi.DataViewValueColumns;
import DataViewValueColumn = powerbi.DataViewValueColumn;
import DataViewValueColumnGroup = powerbi.DataViewValueColumnGroup;
import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewColumnAggregates = powerbi.DataViewColumnAggregates;
import PrimitiveValue = powerbi.PrimitiveValue;

import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IColorPalette = powerbi.extensibility.IColorPalette;

// powerbi-visuals-utils-formattingutils
import {
    valueFormatter as vf,
    textMeasurementService as tms
} from "powerbi-visuals-utils-formattingutils";
import valueFormatter = vf.valueFormatter;
import IValueFormatter = vf.IValueFormatter;
import textMeasurementService = tms.textMeasurementService;

// powerbi-visuals-utils-typeutils
import { pixelConverter as PixelConverter } from "powerbi-visuals-utils-typeutils";

import {
    VisualState,
    Settings,
    ViewportData,
    MeasureData,
    CategoryData,
    DataPoint
} from "./dataInterfaces";
import { VisualSettings } from "./settings";
import { FONT_SIZE, FONT_FAMILY } from "./constants";

const PRECISION: number = 2;
const DISPLAY_UNITS: number = 0;

export const optionsAreValid = (
    options: VisualUpdateOptions
): boolean => {
    try{
        return !!(
            options &&
            options.dataViews &&
            options.dataViews[0] &&
            options.dataViews[0].categorical &&
            options.dataViews[0].categorical.values &&
            options.dataViews[0].categorical.categories &&
            options.dataViews[0].categorical.categories[0]
        );
    } catch (e) {
        return false;
    }
}

/**
 * maps Visual Update Options to Custom Visual global state
 * @param dataView
 */

export const mapOptionsToState = (
    options: VisualUpdateOptions,
    settings: VisualSettings,
    colorPalette: IColorPalette
): VisualState => {
    const dataView: DataView = options.dataViews[0];
    const dataViewPartial: Partial<VisualState> = mapDataView(
        dataView,
        settings,
        colorPalette
    );

    return {
        measures: dataViewPartial.measures,
        entries: dataViewPartial.entries,
        category: dataViewPartial.category,
        viewport: mapViewport(options.viewport),
        settings: settings.barChart as Settings
    };
};

export default mapOptionsToState;

export const mapViewport = (viewport: IViewport): ViewportData => ({
    width: viewport.width,
    height: viewport.height
});

export const mapDataView = (
    dataView: DataView,
    settings: VisualSettings,
    colorPalette: IColorPalette
): Partial<VisualState> => {
    const groups: DataViewValueColumnGroup[] = dataView.categorical.values.grouped();

    const category: DataViewCategoryColumn = dataView.categorical.categories[0];
    const categorySource: DataViewMetadataColumn = (dataView.categorical
        .categories[0] as DataViewCategoricalColumn).source;

    const categoriesFormatter: IValueFormatter = valueFormatter.create({
        format: valueFormatter.getFormatStringByColumn(category.source)
    });

    const categoryDisplayValues: string[] = category.values.map(
        (value: PrimitiveValue) => categoriesFormatter.format(value)
    );

    const getStringLength = (text: string) =>
        textMeasurementService.measureSvgTextWidth({
            text,
            fontFamily: FONT_FAMILY,
            fontSize: PixelConverter.toString(FONT_SIZE)
        });

    const maxCategoryNameWidth: number = categoryDisplayValues.reduce(
        (acc: number, value: string) =>
            getStringLength(value) > acc ? getStringLength(value) : acc,
        0
    );

    const categoryData = {
        displayName: categorySource.displayName,
        count: category.values.length,
        displayValues: categoryDisplayValues,
        formatter: categoriesFormatter,
        maxWidth: maxCategoryNameWidth
    } as CategoryData;

    const groupMeasures = groups[0].values;
    const measures = mapMeasures(groupMeasures, settings, colorPalette);

    const getEntryDataPoints = (entryIndex: number): DataPoint[] =>
        groupMeasures.map(
            (column: DataViewValueColumn, measureIndex: number): DataPoint => ({
                measureIndex,
                value: Number(column.values[entryIndex]),
                displayValue: measures[measureIndex].formatter.format(
                    column.values[entryIndex]
                )
            })
        );

    const mapDataViewGroupsToEntries = (categoryValues: PrimitiveValue[]) =>
        categoryValues.map((value: PrimitiveValue, i: number) => {
            const dataPoints: DataPoint[] = getEntryDataPoints(i);

            return {
                dataPoints,
                index: i,
                sum: dataPoints.reduce(
                    (acc: number, value: DataPoint) => acc + value.value,
                    0
                ),
                name: categoriesFormatter.format(value)
            };
        });

    return {
        measures,
        category: categoryData,
        entries: mapDataViewGroupsToEntries(category.values)
    };
};

export const mapMeasures = (
    measures: DataViewValueColumn[],
    settings: VisualSettings,
    colorPalette: IColorPalette,
): MeasureData[] =>
    measures.map((measure: DataViewValueColumn, index: number) => {
        const measureSource: DataViewMetadataColumn = measure.source;

        const formatter: IValueFormatter = valueFormatter.create({
            format: valueFormatter.getFormatStringByColumn(measureSource),
            precision: PRECISION,
            value: DISPLAY_UNITS
        });

        return (
            measureSource &&
            ({
                index,
                formatter,
                queryName: measureSource.queryName,
                color: index
                    ? settings.barChart.color
                    : colorPalette.getColor(measureSource.displayName).value,
                displayName: measureSource.displayName,
                maxValue: measure.maxLocal,
                minValue: measure.minLocal
            } as MeasureData)
        );
    });
