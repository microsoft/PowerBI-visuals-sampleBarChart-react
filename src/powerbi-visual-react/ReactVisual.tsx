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
import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom";

import DataView = powerbi.DataView;
import VisualObjectInstance = powerbi.VisualObjectInstance;

import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisualEventService =  powerbi.extensibility.IVisualEventService;

import ReactContainer from "./ReactContainer";

import { VisualSettings } from "../settings";

export class ReactVisual implements IVisual {
    protected target: HTMLElement;
    protected host: IVisualHost;
    protected settings: VisualSettings;
    protected events: IVisualEventService;

    protected container: React.ComponentElement<any, any>;

    protected updateContainers: (data: object) => void;

    protected static shouldVisualUpdate(options: VisualUpdateOptions): boolean {
      return !!(options && options.dataViews && options.dataViews[0])
    }

    protected static parseSettings(dataView: DataView): VisualSettings {
      return VisualSettings.parse(dataView) as VisualSettings;
    }

    public render(props: {}): React.ReactElement {
      return React.createElement('div', props);
    }

    constructor(options: VisualConstructorOptions) {
        this.initializeVisualProperties(options);

        this.updateContainers = ReactContainer.update;
        this.container = React.createElement(ReactContainer, { component: this.render });

        ReactDOM.render(this.container, this.target);
    }

    /**
     * initializeVisualProperties
     * @param options VisualConstructorOptions
     */
    protected initializeVisualProperties(options: VisualConstructorOptions){
        this.events = options.host.eventService;
        this.host = options.host;
        this.target = options.element;
    }

    /**
     * 
     * @param options VisualUpdateOptions
     */
    protected updateVisualProperties(options: VisualUpdateOptions){
        this.settings = ReactVisual.parseSettings(options.dataViews[0]);
    }

    /**
     * 
     * @param options VisualUpdateOptions
     */
    public update(options: VisualUpdateOptions) {
      if (!ReactVisual.shouldVisualUpdate(options)){
        return;
      }

      try {
        this.events.renderingStarted(options);
        this.updateVisualProperties(options);

        this.updateContainers(options);
        this.events.renderingFinished(options); 
      }
      catch (e) {
          console.error(e);
          this.events.renderingFailed(options);
      }
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     * @param options EnumerateVisualObjectInstancesOptions
     */
    public enumerateObjectInstances(
      options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

      return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}
