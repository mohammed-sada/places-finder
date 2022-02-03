import { createContext, useReducer } from 'react';

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

export default function StoreProvider({ children }) {
  const storeReducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPES.SET_LAT_LONG:
        return { ...state, latLong: action.payload.latLong };

      case ACTION_TYPES.SET_COFFEE_STORES:
        return {
          ...state,
          localCoffeeStores: action.payload.localCoffeeStores,
        };

      default:
        throw new Error(`Unhandked Action: ${action.type}`);
    }
  };

  const initialState = {
    latLong: '',
    localCoffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}
