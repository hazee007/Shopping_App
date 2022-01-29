import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Colors } from "../utils";
import CartItem from "./CartItem";

export default function OrderItem({ itemData }) {
  const { totalAmount, readableDate } = itemData.item;
  const [showDetails, setShowDetails] = useState(false);
  return (
    <View style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>{readableDate}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => setShowDetails(!showDetails)}
      />
      {showDetails && (
        <View style={styles.detailedItem}>
          {itemData.item.items.map((cartItem) => (
            <CartItem key={cartItem.productId} itemData={cartItem} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888",
  },
  detailedItem: {
    width: "100%",
  },
});
