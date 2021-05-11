import * as React from "react";
import { generateCoilId } from "./core";

export const CoilContext = React.createContext("");

interface IPropsCoilProvider {
  children: React.ReactChildren;
}

export const CoilProvider: React.FC<IPropsCoilProvider> = (
  props: IPropsCoilProvider
) => {
  const { children } = props;
  const id = generateCoilId();
  return <CoilContext.Provider value={id}>{children}</CoilContext.Provider>;
};
