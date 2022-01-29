export const ADD_ORDER = "ADD_ORDER";
export const CLEAR_ORDER = "CLEAR_ORDER";

export const addOrder = (cartItem, totalAmount) => ({
  type: ADD_ORDER,
  orderData: { items: cartItem, amount: totalAmount },
});

export const clearOrder = () => ({ type: CLEAR_ORDER });
