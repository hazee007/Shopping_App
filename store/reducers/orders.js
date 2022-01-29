import Order from "../../models/order";
import { ADD_ORDER, CLEAR_ORDER } from "../actions/order";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        new Date().toString(),
        action.orderData.items,
        action.orderData.amount,
        new Date()
      );
      return { ...state, orders: [...state.orders, newOrder] };
    case CLEAR_ORDER:
      return { ...state, orders: [] };
    default:
      return state;
  }
};
