import * as React from "react";
import * as ReactDOM from "react-dom";

interface ContainerProps {
  component: React.ComponentType<any>
}

type ContainerState = Readonly<{
  data: object
}>;

const initialState: ContainerState = {
  data: {}
};

class ReactContainer extends React.Component<ContainerProps, ContainerState>{
  private static subscriptions: Array<(data: object) => void> = [];
  
  private static subscribe(callback: (data: object) => void) {
    ReactContainer.subscriptions.push(callback);
    return ReactContainer.createUnsubscribeCallback(ReactContainer.subscriptions.length - 1);
  }
  
  private static createUnsubscribeCallback = (i: number) => {
    return () => {
      delete ReactContainer.subscriptions[i];
    }
  }

  public static update(newData: object) {
      ReactContainer.subscriptions.forEach(updateCallback => {
      updateCallback(newData);
    });
  }

  public unsubscribe: () => void;
  
  public state: ContainerState = initialState;

  public constructor(props: ContainerProps){
    super(props);
    this.state = initialState;
    this.update = this.update.bind(this);
  }
  
  public update (newData: object) {
    this.setState({ data: { ...this.state.data, ...newData }})
  }
  
  public componentWillMount() {
    this.unsubscribe = ReactContainer.subscribe(this.update);
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  render(){
    const props = this.state.data;
    const Component = this.props.component;
    return (
      <Component {...props} />
    )
  }
}

export const renderReactVisual = (
  component: React.ComponentType<any>,
  element: HTMLElement,
) => {
  ReactDOM.render(
    React.createElement(ReactContainer, { component }),
    element
  );
  
  return ReactContainer.update;
}

export default renderReactVisual;