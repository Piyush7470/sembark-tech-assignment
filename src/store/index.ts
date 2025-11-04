import { createContext } from 'react';
import cartStore from './CartStore';

export const storeContext = createContext({
    cartStore,
});