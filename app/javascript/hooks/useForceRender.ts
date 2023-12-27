import { useReducer } from "react";

export const useForceRender = () => useReducer((n: number) => n + 1, 0);
