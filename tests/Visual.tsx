import {
  mount,
} from "enzyme";
import * as React from "react";

//import PyramidChart from "../src/components/PyramidChart";
//import { stubProps } from "../src/components/DataStubAdapter";

describe("SolidPyramidChart Component", () => {
  const emptyChart = mount(
    <PyramidChart 
      max={0}
      settings={{}}
      entries={[]}
    />,
  );

  test("Renders React chart frame", () => {
    expect(emptyChart.exists()).toBe(true);
    expect(emptyChart.find(".chart-frame").length).toBe(1);
  });

  test("Renders chart component", () => {
    expect(emptyChart.exists()).toBe(true);
    expect(emptyChart.find(".chart-frame .column-chart-recharts").length).toBeGreaterThanOrEqual(1);
    expect(emptyChart.find(BarChart).length).toBeGreaterThan(0); 
  });

  const stubDataComponent = mount(
    <PyramidChart 
      settings={stubProps.settings}
      max={stubProps.max}
      categoryTitle={stubProps.categoryTitle}
      leftSetTitle={stubProps.leftSetTitle}
      rightSetTitle={stubProps.rightSetTitle}
      entries={stubProps.entries}
      width={1000}
      height={1000}
    />,
  );

  test("Renders all data entries given", () => {
    expect(
      stubDataComponent
      .find(".recharts-yAxis.yAxis .recharts-cartesian-axis-ticks").exists()
    ).toBe(true)
   
    expect(
      stubDataComponent
      .find(".recharts-yAxis.yAxis .recharts-cartesian-axis-ticks")
      .first()
      .find("tspan")
      .length
    ).toBe(stubProps.entries.length)
  })

  test("Renders chart legend", () => {
    expect(stubDataComponent.find(".chart-legend").exists()).toBe(true);
  })
  
  test("Renders correct data titles", () => {
    expect(stubDataComponent.find(".chart-legend .category-title").exists()).toBe(true);
    expect(stubDataComponent.find(".chart-legend .category-title").text()).toContain(stubProps.categoryTitle);
    
    expect(stubDataComponent.find(".chart-legend .left-set-title").exists()).toBe(true);
    expect(stubDataComponent.find(".chart-legend .left-set-title").first().text()).toContain(stubProps.leftSetTitle);
    
    expect(stubDataComponent.find(".chart-legend .right-set-title").exists()).toBe(true);
    expect(stubDataComponent.find(".chart-legend .right-set-title").first().text()).toContain(stubProps.rightSetTitle);
  })

  test("Renders two Y axis", () => {
    expect(
      stubDataComponent
      .find(".recharts-cartesian-axis.recharts-yAxis.yAxis>line").length
    ).toBe(2)
  })

  test("Renders two X axis", () => {
    expect(
      stubDataComponent
      .find(".recharts-cartesian-axis.recharts-xAxis.xAxis>line").length
    ).toBe(2)
  })
});
