import React, { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import {
  CART_ADD_ITEM,
  CART_CLEAR,
  CART_REMOVE_ITEM,
  CART_SET_PAYMENT,
  CART_SET_SHIPPING,
  USER_SIGN_IN,
  USER_SIGN_OUT,
} from './../utils/constants';
export const Store = createContext();
const initialState = {
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: {},
    paymentMethod: '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case USER_SIGN_IN:
      return {
        ...state,
        userInfo: action.payload,
      };

    case USER_SIGN_OUT:
      return {
        ...state,
        userInfo: null,
      };

    case CART_SET_SHIPPING:
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case CART_SET_PAYMENT:
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    case CART_ADD_ITEM: {
      const item = action.payload;
      const existItem = state.cart.cartItems.find((x) => x.name === item.name);
      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.cart.cartItems, item];
      Cookies.set('cartItems', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (x) => x.name !== action.payload.name
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case CART_CLEAR:
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: 'PayPal',
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
