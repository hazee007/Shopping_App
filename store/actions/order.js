import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";
export const CLEAR_ORDER = "CLEAR_ORDER";

export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/orders/u1.json"
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }
      const resData = await response.json();
      const loadedOrders = [];
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItem,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }

      dispatch({
        type: SET_ORDERS,
        orders: loadedOrders,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const addOrder = (cartItem, totalAmount) => {
  return async (dispatch) => {
    try {
      const date = new Date();
      const response = await fetch(
        "https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/orders/u1.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItem,
            totalAmount,
            date: date.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }
      const resData = await response.json();
      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: resData.name,
          items: cartItem,
          amount: totalAmount,
          date,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const clearOrder = () => ({ type: CLEAR_ORDER });
