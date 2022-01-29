import React from "react";
import { FlatList, Button, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { Colors } from "../../utils";
import HeaderButton from "../../components/HeaderButton";
import ProductDetails from "../../components/ProductDetails";
import { deleteProduct } from "../../store/actions/products";

export default function UserProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const userProducts = useSelector((state) => state.products.userProducts);
  const handleSelect = (item) => {
    navigation.navigate("EditProduct", {
      productId: item.item.id,
    });
  };
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
            onPress={() => dispatch(deleteProduct(item.item.id))}
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
