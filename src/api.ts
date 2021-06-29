import { useReducer, useEffect, useContext, useMemo } from "react";
import { Atom, isAtom, Selector, CoilValue } from "./typings";
import { CoilContext } from "./provider";
import {
  coreGetCoilValue,
  registerCoilValue,
  createPublicSetAtomValue,
  createPublicGetCoilValue,
  createPublicSetCoilValue,
  subscribeToCoilValueUpdates,
} from "./core";

export const atom = <T>(a: Atom<T>) => a;

export const selector = <T>(s: Selector<T>) => s;

const useCoilId = () => {
  const coilId = useContext(CoilContext);
  if (!coilId) {
    throw new Error("Wrap your app with <CoilRoot>");
  }

  return coilId;
};

const createDependenciesSpy = (coilId: string, dependencies: string[]) => {
  const dependenciesSpy = (coilValue: CoilValue<any>) => {
    dependencies.push(coilValue.key);

    if (isAtom(coilValue)) {
      return coreGetCoilValue(coilId, coilValue);
    }

    return coilValue.get({ get: dependenciesSpy });
  };

  return dependenciesSpy;
};

type Callback = () => void;

const useSubscribeToCoilValues = <T>(
  coilValue: CoilValue<T>,
  callback: Callback
) => {
  const coilId = useCoilId();

  useEffect(() => {
    if (isAtom(coilValue)) {
      return subscribeToCoilValueUpdates(coilId, coilValue.key, callback);
    }

    const dependencies: string[] = [];
    coilValue.get({ get: createDependenciesSpy(coilId, dependencies) });

    const unsubscribes: Callback[] = [];
    dependencies.forEach(key =>
      unsubscribes.push(subscribeToCoilValueUpdates(coilId, key, callback))
    );

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [coilId, coilValue, callback]);
};

export const useCoilValue = <T>(coilValue: CoilValue<T>) => {
  const coilId = useCoilId();
  const [, forceRender] = useReducer(s => s + 1, 0);

  registerCoilValue(coilId, coilValue);

  useSubscribeToCoilValues(coilValue, forceRender);
  return coreGetCoilValue(coilId, coilValue);
};

export const useCoilState = <T>(coilValue: CoilValue<T>) => {
  const coilId = useCoilId();
  const currentValue = useCoilValue(coilValue);

  const setter = useMemo(() => {
    if (isAtom(coilValue)) {
      return createPublicSetAtomValue(coilId, coilValue);
    }

    return (nextValue: T) => {
      if (coilValue.set)
        coilValue.set(
          {
            get: createPublicGetCoilValue(coilId),
            set: createPublicSetCoilValue(coilId),
          },
          nextValue,
        );
    };
  }, [coilId, coilValue]);

  return [currentValue, setter] as const;
};
