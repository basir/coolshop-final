import React, { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import {
  CART_ADD_ITEM,
  CART_CLEAR,
  CART_REMOVE_ITEM,
} from './../utils/constants';
const SCREEN_SET_WIDTH = 'SCREEN_SET_WIDTH';
export const Store = createContext();
const initialState = {
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: {},
    paymentMethod: 'PayPal',
    taxPrice: 0,
    totalPrice: 0,
    itemsCount: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };

    case CART_ADD_ITEM: {
      const item = action.payload;
      const existItem = state.cart.cartItems.find((x) => x.name === item.name);
      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.cart.cartItems, item];

      const itemsCount = cartItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = cartItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };
    }
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (x) => x.name !== action.payload.name
      );
      const itemsCount = cartItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = cartItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };
    }
    case CART_CLEAR:
      return {
        ...state,
        cart: {
          cartItems: [],
          taxPrice: 0,
          totalPrice: 0,
          itemsCount: 0,
        },
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
