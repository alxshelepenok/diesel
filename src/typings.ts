export type Atom<T> = { key: string; default: T };

export type Selector<T> = {
  key: string;
  get: ({ get }: { get: GetCoilValue }) => T;
  set?: (
    {
      get,
      set,
    }: {
      get: GetCoilValue;
      set: SetCoilValue;
    },
    nextValue: T,
  ) => void;
};

export type CoilValue<T> = Atom<T> | Selector<T>;

type GetCoilValue = <T>(coilValue: CoilValue<T>) => T;
type SetCoilValue = <T>(coilValue: CoilValue<T>, nextValue: T) => void;

export const isAtom = (recoilValue: CoilValue<any>): recoilValue is Atom<any> =>
  Object.keys(recoilValue).includes("default");

export type CoilStores = Record<string, Record<string, CoreCoilValue<unknown>>>;

export type CoreCoilValue<T> = {
  key: string;
  subscribers: Subscriber[];
} & ({ type: "atom"; default: T; value: T } | { type: "selector" });

export type Subscriber = () => void;
