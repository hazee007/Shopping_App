import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";

import { Colors } from "../utils";
import CartItem from "../components/CartItem";
import { removeFromCart } from "../store/actions/cart";
import { addOrder } from "../store/actions/order";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart);
  const cartItemArray = () => {
    const transformedCart = [];
    for (const key in cartItem.items) {
      transformedCart.push({
        productId: key,
        productTitle: cartItem.items[key].productTitle,
        productPrice: cartItem.items[key].productPrice,
        quantity: cartItem.items[key].quantity,
        sum: cartItem.items[key].sum,
      });
    }
    return transformedCart.sort((a, b) => (a.productId > b.productId ? 1 : -1));
  };
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>${cartItem.totalAmount.toFixed(2)}</Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          disabled={cartItemArray().length === 0}
          onPress={() =>
            dispatch(addOrder(cartItemArray(), cartItem.totalAmount))
          }
        />
      </View>
      <FlatList
        data={cartItemArray()}
        keyExtractor={(cartItem) => cartItem.productId}
        renderItem={(itemData) => (
          <CartItem
            itemData={itemData.item}
            onRemove={() => dispatch(removeFromCart(itemData.item.productId))}
          />
        )}
      />
    </View>
  );
}

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});
