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
import { mount } from "enzyme";
import * as React from "react";

import { SampleBarChartReact as VisualComponent } from "../src/visual";
import { mockState } from "./dataMock";

describe("SolidPyramidChart Component", () => {
  const mockDataComponent = mount(
    React.createElement(VisualComponent, mockState ),
  );

  test("Renders React chart frame", () => {
    expect(mockDataComponent.exists()).toBe(true);
    expect(mockDataComponent.find(".bar-chart").length).toBe(1);
  });

  test("Renders chart svg", () => {
    expect(mockDataComponent.exists()).toBe(true);
    expect(mockDataComponent.find(".bar-chart svg").length).toBeGreaterThanOrEqual(1);
    expect(mockDataComponent.find(VisualComponent).length).toBeGreaterThan(0);
  });

  test("Renders all data entries given", () => {
    expect(
        mockDataComponent
        .find(".recharts-yAxis.yAxis .recharts-cartesian-axis-ticks").exists()
    ).toBe(true);

    expect(
        mockDataComponent
        .find(".recharts-yAxis.yAxis .recharts-cartesian-axis-ticks")
        .first()
        .find("tspan")
        .length
    ).toBe(mockState.entries.length);
  })

  test("Renders chart legend", () => {
    expect(mockDataComponent.find(".chart-legend").exists()).toBe(true);
  })

//   test("Renders correct data titles", () => {
//     expect(mockDataComponent.find(".chart-legend .category-title").exists()).toBe(true);
//     expect(mockDataComponent.find(".chart-legend .category-title").text()).toContain(stubProps.categoryTitle);

//     expect(mockDataComponent.find(".chart-legend .left-set-title").exists()).toBe(true);
//     expect(mockDataComponent.find(".chart-legend .left-set-title").first().text()).toContain(stubProps.leftSetTitle);

//     expect(mockDataComponent.find(".chart-legend .right-set-title").exists()).toBe(true);
//     expect(mockDataComponent.find(".chart-legend .right-set-title").first().text()).toContain(stubProps.rightSetTitle);
//   })

//   test("Renders two Y axis", () => {
//     expect(
//         mockDataComponent
//       .find(".recharts-cartesian-axis.recharts-yAxis.yAxis>line").length
//     ).toBe(2)
//   })

//   test("Renders two X axis", () => {
//     expect(
//         mockDataComponent
//       .find(".recharts-cartesian-axis.recharts-xAxis.xAxis>line").length
//     ).toBe(2)
//   })
});
