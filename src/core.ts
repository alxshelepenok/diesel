import {
  Atom,
  isAtom,
  Selector,
  Subscriber,
  CoilValue,
  CoilStores,
} from "./typings";

const coilStores: CoilStores = {};
const getCoilStore = (coilId: string) => {
  coilStores[coilId] = coilStores[coilId] || {};
  return coilStores[coilId];
};

const currentCoilId = 0;
export const generateCoilId = () => (currentCoilId + 1).toString();

const coreGetAtomValue = <T>(coilId: string, atom: Atom<T>): T => {
  const coreCoilValue = getCoilStore(coilId)[atom.key];
  if (coreCoilValue.type !== "atom") {
    throw new Error(`${coreCoilValue.key} is not an atom`);
  }

  return coreCoilValue.value as any as T;
};

const coreGetSelectorValue = <T>(coilId: string, selector: Selector<T>): T =>
  selector.get({ get: createPublicGetCoilValue(coilId) });

export const coreGetCoilValue = <T>(
  coilId: string,
  coilValue: CoilValue<T>,
): T =>
  isAtom(coilValue)
    ? coreGetAtomValue(coilId, coilValue)
    : coreGetSelectorValue(coilId, coilValue);

export const createPublicGetCoilValue =
  <T>(coilId: string) =>
  (coilValue: CoilValue<T>): T =>
    coreGetCoilValue(coilId, coilValue);

export const createPublicSetAtomValue =
  <T>(coilId: string, coilValue: CoilValue<T>) =>
  (nextValue: T) =>
    coreSetAtomValue(coilId, coilValue, nextValue);

const coreSetAtomValue = <T>(
  coilId: string,
  coilValue: CoilValue<T>,
  nextValue: T,
) => {
  const coreCoilValue = getCoilStore(coilId)[coilValue.key];

  if (coreCoilValue.type !== "atom") {
    throw new Error(`${coreCoilValue.key} is not an atom`);
  }

  if (nextValue !== coreCoilValue.value) {
    coreCoilValue.value = nextValue;
    coreCoilValue.subscribers.forEach(callback => callback());
  }
};

export const createPublicSetCoilValue =
  <T>(coilId: string) =>
  (coilValue: CoilValue<T>, nextValue: T) =>
    coreSetCoilValue(coilId, coilValue, nextValue);

const coreSetCoilValue = <T>(
  coilId: string,
  coilValue: CoilValue<T>,
  nextValue: T,
) => {
  if (isAtom(coilValue)) {
    coreSetAtomValue(coilId, coilValue, nextValue);
  } else if (coilValue.set) {
    coilValue.set(
      {
        get: createPublicGetCoilValue(coilId),
        set: createPublicSetCoilValue(coilId),
      },
      nextValue,
    );
  }
};

export const registerCoilValue = <T>(
  coilId: string,
  coilValue: CoilValue<T>,
) => {
  const { key } = coilValue;
  const coilStore = getCoilStore(coilId);

  if (coilStore[key]) {
    return;
  }

  if (isAtom(coilValue)) {
    coilStore[key] = {
      default: coilValue.default,
      key,
      subscribers: [],
      type: "atom",
      value: coilValue.default,
    };
  } else {
    coilStore[key] = {
      key,
      subscribers: [],
      type: "selector",
    };
  }
};

export const subscribeToCoilValueUpdates = (
  coilId: string,
  key: string,
  callback: Subscriber,
) => {
  const coilValue = getCoilStore(coilId)[key];
  const { subscribers } = coilValue;

  if (subscribers.includes(callback)) {
    throw new Error("Already subscribed to Coil Value");
  }

  subscribers.push(callback);

  return () => {
    subscribers.splice(subscribers.indexOf(callback), 1);
  };
};
