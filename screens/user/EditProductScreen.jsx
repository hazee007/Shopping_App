import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import HeaderButton from "../../components/HeaderButton";
import { createProduct, updateProduct } from "../../store/actions/products";

export default function EditProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const productId = navigation.getParam("productId");
  const product = useSelector((state) =>
    state.products.userProducts.find((p) => p.id === productId)
  );

  const [formData, setFormData] = useState({
    title: product?.title ?? "",
    imageUrl: product?.imageUrl ?? "",
    price: "",
    description: product?.description ?? "",
  });
  const { title, imageUrl, price, description } = formData;
  const handleChange = (event, name) => {
    setFormData({ ...formData, [name]: event.nativeEvent.text });
  };

  const onSubmit = useCallback(() => {
    if (product) {
      dispatch(updateProduct(productId, formData));
    } else {
      const data = { ...formData, price: +formData.price };
      dispatch(createProduct(data));
    }
    navigation.goBack();
  }, [formData, dispatch, productId, product]);

  useEffect(() => {
    navigation.setParams({ submit: onSubmit });
  }, [onSubmit]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.container}>
          <Text style={styles.labels}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChange={(event) => handleChange(event, "title")}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.labels}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChange={(event) => handleChange(event, "imageUrl")}
          />
        </View>
        {product?.price ? null : (
          <View style={styles.container}>
            <Text style={styles.labels}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChange={(event) => handleChange(event, "price")}
            />
          </View>
        )}
        <View style={styles.container}>
          <Text style={styles.labels}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChange={(event) => handleChange(event, "description")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: { margin: 20 },
  container: {
    width: "100%",
  },
  labels: { fontFamily: "open-sans-bold", marginVertical: 8 },
  input: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
