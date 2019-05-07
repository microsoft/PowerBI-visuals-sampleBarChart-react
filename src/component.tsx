import * as React from "react";
import { ChartProps, ChartEntry } from "./dataInterfaces";
import { BarChart } from "./components/BarChart";
import { SingleValueTable } from "./components/SingleValueTable"
import { Legend } from "./components/Legend";

import { BAR_COLOR, LEGEND_HEIGHT } from "./constants";

export class ReactSampleBarChart extends React.Component<ChartProps>{

  private static updateCallback: (data: object) => void = null;

  render(){
      const { width, height, color, entries, minValue, maxValue,  measureTitle, categoryTitle } = this.props;

      // const style: React.CSSProperties = { width, height };

      console.warn('RENDER', this.props);
      const measures = [{ displayName: measureTitle, color: BAR_COLOR }];
      return (<div>
        <Legend { ...{ width,  color, height: LEGEND_HEIGHT, measures }} />
        <BarChart { ...{ width, height,  color, minValue, maxValue, entries, measureTitle, categoryTitle } }/>
        {/* <SingleValueTable { ...{ width, height,  minValue, maxValue, entries, measureTitle, categoryTitle } }/> */}
        
        <hr/>
      </div>)
  }
}