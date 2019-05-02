import * as React from "react";
import { ChartProps, ChartEntry } from "./dataInterfaces";
import { BarChart } from "./components/BarChart";
import { SingleValueTable } from "./components/SingleValueTable"

export class ReactSampleBarChart extends React.Component<ChartProps>{

  private static updateCallback: (data: object) => void = null;

  render(){
      const { width, height, entries, minValue, maxValue,  measureTitle, categoryTitle } = this.props;

      // const style: React.CSSProperties = { width, height };

      console.warn('RENDER', this.props);

      return (<div>
        hello
        <hr/>
        <BarChart { ...{ width, height,  minValue, maxValue, entries, measureTitle, categoryTitle } }/>
        {/* <SingleValueTable { ...{ width, height,  minValue, maxValue, entries, measureTitle, categoryTitle } }/> */}
        
        <hr/>
      </div>)
  }
}