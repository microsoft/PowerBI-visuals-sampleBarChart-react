/*
*  Power BI Visual CLI
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
"use strict";
import "@babel/polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import powerbi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;

import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { ReactSampleBarChart } from "./component";
import { ReactVisual } from "./reactUtils";
import { VisualSettings } from "./settings";
import { ChartProps, ChartEntry } from "./dataInterfaces";
import "./../style/visual.less";

export const NBSP: string = " ";

export const mapDataView = (dataView: powerbi.DataView): Partial<ChartProps> => {

  const measures = dataView.categorical.values.grouped();
  
  const names = dataView.categorical.categories[0].values as string[];
  const values = measures[0].values[0].values as number[];
 
  const result: ChartProps = {
    categoryTitle: String(dataView.categorical.categories[0].source.displayName),
    measureTitle: String(dataView.categorical.values[0].source.displayName),
    maxValue: Number(dataView.categorical.values[0].maxLocal),
    minValue: Number(dataView.categorical.values[0].minLocal),
    entries: values.map((value: number, index: number) => ({ 
      name: names[index],  
      value,
      displayValue: Math.min(value, values[index]),
    })) as ChartEntry[],
  };
  console.log('mapDataView', measures, dataView, '=>', result);
  
  return result;
}

export class Visual extends ReactVisual implements IVisual {
  private settings: VisualSettings;
  private viewport: IViewport;

  protected static shouldVisualUpdate(options: VisualUpdateOptions): boolean {
    return true; // !!(options && options.dataViews && options.dataViews[0])
  }

  constructor(options: VisualConstructorOptions) {
    super(options);
    this.reactRenderer = this.createReactContainer(ReactSampleBarChart);
    
    this.reactMount();
  }
    /**
     * initializeVisualProperties
     * @param options VisualConstructorOptions
     */
  protected initializeVisualProperties(options: VisualConstructorOptions){
    // this.host = options.host;
    // this.target = options.element;
  }

  protected initializeReactContainers(options: VisualConstructorOptions){

  }

  public update(options: VisualUpdateOptions) {
    console.warn('UPD');
    
    // if(Visual.shouldVisualUpdate(options)) {
      const dataView: DataView = options.dataViews[0];
      this.viewport = options.viewport;
      const { width, height } = this.viewport;
    //   const size = Math.min(width, height);

      this.settings = Visual.parseSettings(dataView);

      console.warn('UPDATE', dataView, mapDataView(dataView));
      this.updateReactContainers({ width, height, ...mapDataView(dataView) })
    // }
  }
 
  public enumerateObjectInstances(
      options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

      return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  }
  
    /**
     * 
     * @param options VisualUpdateOptions
     */
  protected updateVisualProperties(options: VisualUpdateOptions){
      this.settings = Visual.parseSettings(options.dataViews[0]);
  }
  
  //mapper
  protected static parseSettings(dataView: DataView): VisualSettings {
    return VisualSettings.parse(dataView) as VisualSettings;
  }

  private clear() {

  }

}