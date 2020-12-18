import { CART_ADD_ITEM } from './constants';

import Cookies from 'js-cookie';
export const addToOrder = async (dispatch, item, cartItems) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: item,
  });
};
