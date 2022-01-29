import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";

export default function ({ itemData, onSelect, children }) {
  let Touchable = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    Touchable = TouchableNativeFeedback;
  }

  return (
    <View style={styles.productItem}>
      <Touchable onPress={onSelect} useForeground>
        <View>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{ uri: itemData.item.imageUrl }}
              style={styles.bgImage}
            ></ImageBackground>
          </View>

          <View style={styles.details}>
            <Text style={styles.title}>{itemData.item.title}</Text>
            <Text style={styles.price}>${itemData.item.price}</Text>
          </View>
          <View style={styles.actions}>{children}</View>
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    width: "100%",
    height: "100%",
  },

  productItem: {
    height: 300,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },

  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },

  details: {
    alignItems: "center",
    height: "15%",
    padding: 10,
  },

  title: {
    color: "black",
    fontSize: 18,
    fontFamily: "open-sans-bold",
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: "open-sans",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
});
