import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import ProductList from "../components/ProductList";
import HeaderButton from "../components/HeaderButton";
import { fetchProducts } from "../store/actions/products";
import { Colors } from "../utils";

export default function ProductsOverviewScreen({ navigation }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const loadProducts = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
      await dispatch(fetchProducts());
    } catch (error) {
      setError(error.message);
    }
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    loadProducts().then(() => setLoading(false));
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const willFocusSub = navigation.addListener("willFocus", loadProducts);
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  if (error)
    return (
      <View style={styles.activityIndicator}>
        <Text>An error occurred.</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );

  if (loading)
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (!loading && availableProducts.length === 0) {
    return (
      <View style={styles.activityIndicator}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <ProductList
      refreshing={refreshing}
      onRefresh={loadProducts}
      data={availableProducts}
      navigation={navigation}
    />
  );
}

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName="ios-cart"
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
