import React from "react";
import { FlatList, Button, Platform, Alert, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { Colors } from "../../utils";
import HeaderButton from "../../components/HeaderButton";
import ProductDetails from "../../components/ProductDetails";
import { deleteProduct } from "../../store/actions/products";

export default function UserProductScreen({ navigation }) {
  const deleteHandler = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",

      [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => dispatch(deleteProduct(id)),
        },
      ]
    );
  };
  const dispatch = useDispatch();
  const userProducts = useSelector((state) => state.products.userProducts);
  const handleSelect = (item) => {
    navigation.navigate("EditProduct", {
      productId: item.item.id,
    });
  };

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <ProductDetails itemData={item} onSelect={() => handleSelect(item)}>
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => handleSelect(item)}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => deleteHandler(item.item.id)}
          />
        </ProductDetails>
      )}
    />
  );
}

UserProductScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};
