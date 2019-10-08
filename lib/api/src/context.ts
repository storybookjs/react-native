import { createContext as ReactCreateContext } from 'react';
import { Combo } from './index';

export const createContext = ({ api, state }: Combo) => ReactCreateContext({ api, state });
