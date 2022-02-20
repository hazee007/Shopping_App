import React from "react";
import { View, StyleSheet, FlatList, Button } from "react-native";
import { useDispatch } from "react-redux";

import ProductDetails from "./ProductDetails";
import { Colors } from "../utils";
import { addToCart } from "../store/actions/cart";

export default function ({ data, navigation, onRefresh, refreshing }) {
  const dispatch = useDispatch();
  const handleSelect = (itemData) => {
    navigation.navigate("ProductDetails", {
      productId: itemData.item.id,
      productTitle: itemData.item.title,
    });
  };
  const renderMealItem = (itemData) => {
    return (
      <ProductDetails
        itemData={itemData}
        onSelect={() => handleSelect(itemData)}
      >
        <Button
          color={Colors.primary}
          title="View Details"
          onPress={() => handleSelect(itemData)}
        />
        <Button
          color={Colors.primary}
          title="Add to cart"
          style={styles.buttons}
          onPress={() => dispatch(addToCart(itemData.item))}
        />
      </ProductDetails>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={data}
        renderItem={renderMealItem}
        styles={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});
