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

import * as React from "react";
import { ReactVisual, ReactContainer } from './powerbi-visual-react';
import powerbi from "powerbi-visuals-api";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import "./../style/visual.less";

export class Visual extends ReactVisual implements IVisual {
  public update(options: VisualUpdateOptions) {
    super.update(options);
  }

  /**
   * mapVisualProperties
   */
  public mapVisualProperties() {
    return {
      settings: this.settings
    }
  }

  /**
   * mapUpdateOptions
   */
  public mapUpdateOptions(visualOptions: VisualUpdateOptions) {
    if (visualOptions.dataViews && visualOptions.dataViews[0]) {
      const dataView = visualOptions.dataViews[0];
      return {
        textLabel: dataView.metadata.columns[0].displayName,
        textValue: dataView.single.value
      }
    }
    else {
      return {}
    }
  }

  /**
   * mapUpdateOptions
   */
  public getRenderer(): 
    React.ComponentType<{ textValue: string, textLabel: string }>
  {
    return (props: { textValue: string, textLabel: string }): React.ReactElement => {
      const { textValue, textLabel } = props;
      return (
        <div className="circleCard">
          {
            textValue && textLabel &&
            <p>
              {textLabel}
              <hr/>
              <em>{textValue}</em>
            </p>
          }
        </div>
      )
    }
  }
}