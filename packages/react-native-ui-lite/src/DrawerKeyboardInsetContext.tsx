import { createContext, useContext } from 'react';

export const DrawerKeyboardInsetContext = createContext(0);

export const useDrawerKeyboardInset = () => useContext(DrawerKeyboardInsetContext);
