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
import { MouseEvent } from "react";

import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;

import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import IColorPalette = powerbi.extensibility.IColorPalette;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { ColorHelper } from "powerbi-visuals-utils-colorutils";

import { VisualState, DataEntry } from "./dataInterfaces";
import { LEGEND_HEIGHT } from "./constants";
import { VisualSettings } from "./settings";
import { ReactVisual } from "./reactUtils";
import { mapOptionsToState, optionsAreValid } from "./optionsMapper";

import { RechartsBarChart } from "./components/RechartsBarChart";
import { Legend } from "./components/Legend";
import "./../style/visual.less";

export interface ChartState {
  isTooltipShown?: boolean;
  tooltipEntry?: DataEntry;
}

export class SampleBarChartReact extends React.Component<
  VisualState,
  ChartState
> {
  constructor(props: VisualState) {
    super(props);
    this.showTooltipAction = this.showTooltipAction.bind(this);
    this.hideTooltipAction = this.hideTooltipAction.bind(this);
  }

  public state: ChartState = {};

  showTooltipAction(tooltipEntry: DataEntry) {
    this.setState({ isTooltipShown: true, tooltipEntry });
  }

  hideTooltipAction() {
    this.setState({ isTooltipShown: false });
  }

  public render() {
    const { viewport, category, settings, entries, measures } = this.props;
    const { isTooltipShown, tooltipEntry } = this.state;

    return viewport && category && settings && entries && measures ? (
      <div className={"bar-chart-wrapper"} style={{ position: "relative" }}>
        <Legend {...{ ...viewport, height: LEGEND_HEIGHT, measures }} />
        <RechartsBarChart
          {...{
            ...viewport,
            measures,
            entries,
            category,
            isClustered: settings.isClustered,
            tooltipEnabled: settings.tooltipEnabled,
            gridEnabled: settings.gridEnabled
          }}
        />
      </div>
    ) : (
      <div />
    );
  }
}

export class Visual extends ReactVisual implements IVisual {
  private settings: VisualSettings;
  private visualHost: IVisualHost;
  private events: IVisualEventService;

  private colorPalette: IColorPalette;
  private colorHelper: ColorHelper;

  private state: VisualState;

  protected static shouldVisualUpdate(options: VisualUpdateOptions): boolean {
    return optionsAreValid(options);
  }

  constructor(options: VisualConstructorOptions) {
    super(options);
    this.initializeVisualProperties(options);
    this.initializeReact(options);
  }

  protected initializeVisualProperties(options: VisualConstructorOptions) {
    this.visualHost = options.host;

    this.events = options.host.eventService;
    this.colorPalette = this.visualHost.colorPalette;
    this.colorHelper = new ColorHelper(this.colorPalette);
  }

  protected initializeReact(options: VisualConstructorOptions) {
    this.reactRenderer = this.createReactContainer(SampleBarChartReact);
    this.reactMount();
  }

  public update(options: VisualUpdateOptions) {
    if (Visual.shouldVisualUpdate(options)) {
      this.events.renderingStarted(options);

      this.updateVisualProperties(options);

      this.state = mapOptionsToState(options, this.settings, this.colorPalette);

      this.updateReactContainers(this.state);

      this.events.renderingFinished(options);
    }
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    const objectName: string = options.objectName;
    const instanceEnumeration: VisualObjectInstanceEnumeration = VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );

    if (objectName === "barChart") {
      this.state.measures.forEach(measure => {
        const instance: VisualObjectInstance = {
          displayName: measure.displayName,
          objectName: "barChart",
          selector: { metadata: measure.queryName },
          properties: {
            fill: { solid: { color: measure.color } }
          }
        };

        if (
          (instanceEnumeration as VisualObjectInstanceEnumerationObject)
            .instances
        ) {
          (instanceEnumeration as VisualObjectInstanceEnumerationObject).instances.push(
            instance
          );
        } else {
          (instanceEnumeration as VisualObjectInstance[]).push(instance);
        }
      });
    }

    return (
      (instanceEnumeration as VisualObjectInstanceEnumerationObject)
        .instances || []
    );
  }

  protected updateVisualProperties(options: VisualUpdateOptions) {
    this.settings = Visual.parseSettings(options.dataViews[0]);
  }

  protected static parseSettings(dataView: DataView): VisualSettings {
    return VisualSettings.parse(dataView) as VisualSettings;
  }
}
