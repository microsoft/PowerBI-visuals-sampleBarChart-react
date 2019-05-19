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
import TextProperties = tms.TextProperties;
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


export const mapMeasures = (
    measures: DataViewValueColumn[],
    colorPalette: IColorPalette
): MeasureData[] =>
    measures.map((measure: DataViewValueColumn, index: number) => {
        const measureSource: DataViewMetadataColumn = measure.source;

        const formatter: IValueFormatter = valueFormatter.create({
            format: valueFormatter.getFormatStringByColumn(measureSource),
            precision: PRECISION, // ex settings.labels.labelPrecision,
            value: DISPLAY_UNITS // ex settings.labels.labelDisplayUnits || maxValue
        });

        return (
            measureSource &&
            ({
                index,
                formatter,
                color: colorPalette.getColor(measureSource.displayName + index)
                    .value,
                displayName: measureSource.displayName,
                maxValue: measure.maxLocal,
                minValue: measure.minLocal
            } as MeasureData)
        );
    });

export const mapDataView = (
    dataView: DataView,
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

    const maxCategoryNameLength: number = categoryDisplayValues.reduce(
        (acc: number, value: string) =>
            value.length > acc ? value.length : acc,
        0
    );
    const charWidth = textMeasurementService.measureSvgTextWidth({
        text: "M",
        fontFamily: FONT_FAMILY,
        fontSize: PixelConverter.toString(FONT_SIZE),
    });

    const maxCategoryNameWidth: number = maxCategoryNameLength * charWidth;

    const categoryData = {
        displayName: categorySource.displayName,
        count: category.values.length,
        displayValues: categoryDisplayValues,
        formatter: categoriesFormatter,
        maxLength: maxCategoryNameLength,
        maxWidth: maxCategoryNameWidth
    } as CategoryData;

    const groupMeasures = groups[0].values;
    const measures = mapMeasures(groupMeasures, colorPalette);

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
