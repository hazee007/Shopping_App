import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Platform,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import OrderItem from "../components/OrderItem";
import { fetchOrders } from "../store/actions/order";
import { Colors } from "../utils";

export default function OrdersScreen() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(fetchOrders());
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  if (error)
    return (
      <View style={styles.activityIndicator}>
        <Text>An error occurred.</Text>
        <Button title="Try again" onPress={loadOrders} color={Colors.primary} />
      </View>
    );

  if (loading)
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (!loading && orders.length === 0) {
    return (
      <View style={styles.activityIndicator}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.id}
      renderItem={(itemData) => <OrderItem itemData={itemData} />}
    />
  );
}

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
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
  };
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
