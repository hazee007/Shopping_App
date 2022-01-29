import React from "react";
import { FlatList, Button } from "react-native";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import ProductDetails from "../../components/ProductDetails";
import { Colors } from "../../utils";

export default function UserProductScreen() {
  const userProducts = useSelector((state) => state.products.userProducts);
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <ProductDetails itemData={item} onSelect={() => {}}>
          <Button
            color={Colors.primary}
            title="Edit"
            // onPress={() => handleSelect(itemData)}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            // onPress={() => dispatch(addToCart(itemData.item))}
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
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
