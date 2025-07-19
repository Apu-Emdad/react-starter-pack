import { createContext, useContext } from "react";

export const AppContext = createContext<any>({});
export const useAppContext = () => useContext(AppContext);
