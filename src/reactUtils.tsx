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
import * as ReactDOM from "react-dom";
import powerbi from 'powerbi-visuals-api';

import IVisual = powerbi.extensibility.visual.IVisual;

import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;

interface ContainerProps {
  component: React.ComponentType<any>;
}

type ContainerState = Readonly<{
  data: Partial<VisualUpdateOptions>
}>;

const initialState: ContainerState = {
  data: {}
};

export class ReactContainer extends React.Component<ContainerProps, ContainerState> {
  private static subscriptions: Array<(data: ContainerState) => void> = [];

  private static subscribe(callback: (data: ContainerState) => void) {
    ReactContainer.subscriptions.push(callback);
    return ReactContainer.createUnsubscribeCallback(ReactContainer.subscriptions.length - 1);
  }

  private static createUnsubscribeCallback = (i: number) => {
    return () => {
      delete ReactContainer.subscriptions[i];
    };
  }

  public static update(newData: ContainerState) {

      ReactContainer.subscriptions.forEach(updateCallback => {
      updateCallback(newData);
    });
  }

  public unsubscribe: () => void;

  public state: ContainerState = initialState;

  public constructor(props: ContainerProps) {
    super(props);
    this.state = initialState;
    this.update = this.update.bind(this);
  }

  public update (newData: ContainerState) {
    this.setState({ data: { ...this.state.data, ...newData }});
  }

  public componentWillMount() {
    this.unsubscribe = ReactContainer.subscribe(this.update);
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.state.data;
    const Component = this.props.component;
    return (
      <Component {...props} />
    );
  }
}


export abstract class ReactVisual {
    protected reactTarget: HTMLElement;
    protected reactRenderer: React.ComponentType;
    protected reactContainers: React.ComponentType[];

    protected updateReactContainers: (data: object) => void = ReactContainer.update;

    protected createReactContainer(component: React.ComponentType) {
        return (props: any) => React.createElement(ReactContainer, { component });
    }

    protected reactMount(): void {
        ReactDOM.render(React.createElement(this.reactRenderer), this.reactTarget);
    }

    public renderer: () => React.ElementType;

    constructor(options: VisualConstructorOptions) {
        this.reactTarget = options.element;
    }
}