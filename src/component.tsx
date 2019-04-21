import React from "react";

export interface Props {
  textValue: string,
  textLabel: string
};

export const CircleCard: React.FunctionComponent<Props> = (props: Props)=> {
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