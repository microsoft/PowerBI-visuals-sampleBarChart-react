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
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;

import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import IColorPalette = powerbi.extensibility.IColorPalette;
import IVisualEventService =  powerbi.extensibility.IVisualEventService;

import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { ColorHelper } from "powerbi-visuals-utils-colorutils";

import { VisualState, DataEntry } from "./dataInterfaces";
import { BAR_COLOR, LEGEND_HEIGHT } from "./constants";
import { VisualSettings } from "./settings";
import { ReactVisual } from "./reactUtils";
import optionsMapper from "./optionsMapper"; //TODO rename

import { BarChart } from "./components/BarChart";
import { Legend } from "./components/Legend";
import { Tooltip } from "./components/Tooltip";
import "./../style/visual.less";


export interface ChartState {
  showTooltip?: boolean;
  tooltipEntry?: DataEntry;
  x?: number;
  y?: number;
}

export class SampleBarChartReact extends React.Component<VisualState, ChartState>  {
  constructor(props){
    super(props);
    this.showTooltipAction = this.showTooltipAction.bind(this);
    this.hideTooltipAction = this.hideTooltipAction.bind(this);
  }
  state: ChartState = {};

  showTooltipAction(tooltipEntry: DataEntry, x: number, y: number){
    console.warn('TOOLTIP', tooltipEntry);
    
    this.setState({ showTooltip: true, tooltipEntry, x, y });
  }

  hideTooltipAction(){
    console.warn('TOOLTIP OFF');
    this.setState({ showTooltip: false });
  }

  public render() {
    const { viewport, category, settings, entries, measures } = this.props;
    const { showTooltip, tooltipEntry, x, y } = this.state;
    
    return (
      (viewport && category && settings && entries && measures) 
      ? (
        <div style={{ position: 'relative' }}>
          { showTooltip && 
          <Tooltip 
            index={tooltipEntry.index}
            name={tooltipEntry.name}
            dataPoints={tooltipEntry.dataPoints}
            sum={tooltipEntry.sum}
            measures={measures}
            x={x} 
            y={y}
            categoryTitle={category.displayName}
            categoryValue={tooltipEntry.name}
          />}
          <Legend { ...{ ...viewport, height: LEGEND_HEIGHT, measures }} />
          <BarChart { ...{ 
            ...viewport, 
            measures,
            entries,
            showTooltip: this.showTooltipAction,
            hideTooltip: this.hideTooltipAction
          } }/>
    </div>)
    : <div> </div>)
  }
}


export class Visual extends ReactVisual implements IVisual {
  private settings: VisualSettings;
  private viewport: IViewport;
  private visualHost: IVisualHost;
  private events: IVisualEventService;

  private colorPalette: IColorPalette;
  private colorHelper: ColorHelper;

  protected static shouldVisualUpdate(options: VisualUpdateOptions): boolean {
    return true; // !!(options && options.dataViews && options.dataViews[0])
  }

  constructor(options: VisualConstructorOptions) {
    super(options);
    this.initializeVisualProperties(options);
    this.initializeReact(options);
  }

  /**
   * TODO docs initializeVisualProperties
   * @param options VisualConstructorOptions
   */
  protected initializeVisualProperties(options: VisualConstructorOptions){
    
    this.visualHost = options.host;

    this.events = options.host.eventService;
    this.colorPalette = this.visualHost.colorPalette;
    this.colorHelper = new ColorHelper(this.colorPalette);
  }

  protected initializeReact(options: VisualConstructorOptions){
    this.reactRenderer = this.createReactContainer(SampleBarChartReact);
    this.reactMount();
  }

  /**
   * TODO docs
   * @param options 
   */
  public update(options: VisualUpdateOptions) {
    this.viewport = options.viewport;
    // if(Visual.shouldVisualUpdate(options)) {
    try {
        this.events.renderingStarted(options);

        this.updateVisualProperties(options);

        const newState: VisualState = optionsMapper(
          options, 
          this.settings, 
          this.colorPalette
        );

        this.updateReactContainers(newState);

        this.events.renderingFinished(options);
    }
    catch (e) {
        console.error(e);
         this.events.renderingFailed(options);
    }
  }
 
  public enumerateObjectInstances(
      options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

      return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  }
  
  /**
   * TODO docs
   * @param options VisualUpdateOptions
   */
  protected updateVisualProperties(options: VisualUpdateOptions){
      this.settings = Visual.parseSettings(options.dataViews[0]);
  }
  
  // TODO mapper
  protected static parseSettings(dataView: DataView): VisualSettings {
    return VisualSettings.parse(dataView) as VisualSettings;
  }

  private clear() {
    // TODO
  }

}