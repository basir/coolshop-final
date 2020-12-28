import React, { createContext, useReducer } from 'react';
import {
  CART_RETRIEVE_REQUEST,
  CART_RETRIEVE_SUCCESS,
  ORDER_SET,
} from './../utils/constants';
export const Store = createContext();
const order =
  typeof window !== 'undefined' && window.localStorage.getItem('order_receipt')
    ? JSON.parse(window.localStorage.getItem('order_receipt'))
    : null;
const initialState = {
  cart: { loading: true },
  order,
};

function reducer(state, action) {
  switch (action.type) {
    case CART_RETRIEVE_REQUEST:
      return {
        ...state,
        cart: { loading: true },
      };
    case CART_RETRIEVE_SUCCESS:
      return {
        ...state,
        cart: { loading: false, data: action.payload },
      };
    case ORDER_SET:
      return {
        ...state,
        order: action.payload,
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
