
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

import { VisualState,
  Settings,
  ViewportData,
  MeasureData,
  CategoryData,
  DataEntry, 
  DataPoint 
} from "./dataInterfaces";
import { VisualSettings } from "./settings";


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
    const dataViewPartial: Partial<VisualState> = mapDataView(dataView, colorPalette);

    return {
      measures: dataViewPartial.measures,
      entries:  dataViewPartial.entries,
      category: mapCategory(dataView),
      viewport: mapViewport(options.viewport),
      settings: settings.barChart as Settings,
    };
}

export default mapOptionsToState;


export const mapViewport = (viewport: IViewport): ViewportData => ({
    width: viewport.width,
    height: viewport.width
});


export const mapCategory = (dataView: DataView): CategoryData => {
  const category: DataViewCategoryColumn = dataView.categorical.categories[0];
  const categorySource: DataViewMetadataColumn = 
    (dataView.categorical.categories[0] as DataViewCategoricalColumn).source;

  return ({
    displayName: categorySource.displayName,
    count: category.values.length,
    maxNameLenght: category.values.reduce( //TODO helper
      (acc: number, value: PrimitiveValue) => String(value).trim().length > acc 
        ? String(value).trim().length
        : acc,
      0
    )
  }) as CategoryData;
}


export const mapMeasures = (
  measures: DataViewValueColumn[],
  colorPalette: IColorPalette
): MeasureData[] => measures.map( 
  (measure: DataViewValueColumn, index: number) => {
    const measureSource: DataViewMetadataColumn = measure.source;

    return measureSource && ({
        index,
        color: colorPalette.getColor(measureSource.displayName+index).value,
        displayName: measureSource.displayName,
        maxValue: measure.maxLocal,
        minValue: measure.minLocal,
    }) as MeasureData;
  }
);

export const mapDataView = (
  dataView: DataView,
  colorPalette: IColorPalette
): Partial<VisualState> => {
    const groups: DataViewValueColumnGroup[] = dataView.categorical.values.grouped();
    
    const category = dataView.categorical.categories[0];
    
    const groupMeasures = groups[0].values;
    console.warn('DBG groups', groups, 'groupMeasures', groupMeasures, 'category', category,  'dataView', dataView);

    const names = dataView.categorical.categories[0].values as string[];

    const getEntryDataPoints = (
      entryIndex: number
      ): DataPoint[] => 
      groupMeasures.map(
        (column: DataViewValueColumn, measureIndex: number): DataPoint => ({
            measureIndex,
            value: Number(column.values[entryIndex]),
            displayValue: String(column.values[entryIndex]),//TODO Formatter
          })
      );
  
    const mapDataViewGroupsToEntries = (caterogyValues: PrimitiveValue[]) => caterogyValues.map(
      (value: PrimitiveValue, i: number) => {
        const dataPoints: DataPoint[] = getEntryDataPoints(i);
        
        return ({ 
          dataPoints,
          index: i,
          sum: dataPoints.reduce( 
            (acc: number, value: DataPoint) => acc + value.value, 
            0),
          name: String(value), // TODO formatter
      })
    }
    )
  
    return {
      measures: mapMeasures(groupMeasures, colorPalette),
      entries: mapDataViewGroupsToEntries(category.values),
    };
  };