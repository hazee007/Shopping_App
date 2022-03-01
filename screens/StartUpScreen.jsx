import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../utils";
import { useDispatch } from "react-redux";
import { authenticate } from "../store/actions/auth";

export default function StartUpScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        navigation.navigate("Auth");
        return;
      }
      const transFormedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transFormedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= Date.now() || !token || !userId) {
        navigation.navigate("Auth");
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      dispatch(authenticate(userId, token, expirationTime));
      navigation.navigate("Shop");
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
