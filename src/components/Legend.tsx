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
import { Measure } from "./Measure";
import { MeasureData } from "../dataInterfaces";

export interface LegendProps {
  measures: MeasureData[];
  reportHeight?: (legendHeight: number) => void;
}

export class Legend extends React.PureComponent<LegendProps>{

  constructor(props: LegendProps) {
    super(props);
  }

  public componentDidMount() {
    if (this.legendRef.current && this.props.reportHeight) {
      this.props.reportHeight(this.legendRef.current.offsetHeight );
    }
  }

  private legendRef = React.createRef<any>();

  public render() {
    const { measures } = this.props;

    return (
        <div
          ref={this.legendRef}
          className="chart-legend"
        >
          {measures.map(measure => (
            <Measure {...measure} />
          ))}
        </div>
    );
  }
}

export default Legend;
