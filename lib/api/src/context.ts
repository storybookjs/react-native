import React from 'react';
import { Combo } from './index';

export const createContext = ({ api, state }: Combo) => React.createContext({ api, state });
