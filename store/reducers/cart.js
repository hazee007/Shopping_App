import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/order";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const price = addedProduct.price;
      const title = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          price,
          title,
          state.items[addedProduct.id].sum + price
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, price, title, price);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + price,
      };

      break;
    case REMOVE_FROM_CART:
      const productId = action.id;
      const selectedCartItem = state.items[productId];
      const currentQuantity = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQuantity > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [productId]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[productId];
      }

      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT: {
      if (!state.items[action.id]) {
        return state;
      }
      const updatedCartItem = { ...state.items };
      const itemTotal = updatedCartItem[action.id].sum;
      delete updatedCartItem[action.id];
      return {
        ...state,
        items: updatedCartItem,
        totalAmount: state.totalAmount - itemTotal,
      };
    }
    default:
      return state;
  }
};
