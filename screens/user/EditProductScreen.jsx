import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  // KeyboardAvoidingView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import HeaderButton from "../../components/HeaderButton";
import InputField from "../../components/InputField";
import { createProduct, updateProduct } from "../../store/actions/products";
import { Colors } from "../../utils";

const formReducer = (state, action) => {
  switch (action.type) {
    case "FORM_INPUT_UPDATE":
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updateFormIsValid = true;
      for (const key in updatedValidities) {
        updateFormIsValid = updateFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updateFormIsValid,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
      };
    default:
      return state;
  }
};

export default function EditProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const productId = navigation.getParam("productId");
  const product = useSelector((state) =>
    state.products.userProducts.find((p) => p.id === productId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: product?.title ?? "",
      imageUrl: product?.imageUrl ?? "",
      description: product?.description ?? "",
      price: "",
    },
    inputValidities: {
      title: product?.title ? true : false,
      imageUrl: product?.imageUrl ? true : false,
      description: product?.description ? true : false,
      price: product ? true : false,
    },
    formIsValid: product ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  const { title, imageUrl, price, description } = formState.inputValues;
  const handleChange = useCallback(
    (id, value, isValid) => {
      dispatchFormState({
        type: "FORM_INPUT_UPDATE",
        value,
        isValid,
        input: id,
      });
    },
    [dispatchFormState]
  );

  const onSubmit = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input!", "Please enter a valid input.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (product) {
        await dispatch(updateProduct(productId, formState.inputValues));
      } else {
        const data = {
          ...formState.inputValues,
          price: +formState.inputValues.price,
        };
        await dispatch(createProduct(data));
      }
      navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  }, [formState, dispatch, productId, product]);

  useEffect(() => {
    navigation.setParams({ submit: onSubmit });
  }, [onSubmit]);

  if (loading)
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  return (
    <ScrollView>
      <View style={styles.form}>
        <InputField
          label="Title"
          value={title}
          id="title"
          errorText="Please enter a valid title"
          handleChange={handleChange}
          autoCapitalize="sentences"
          autoCorrect
          returnKeyLabel="next"
          required
          isValid={formState.inputValidities.title}
        />
        <InputField
          label="Image Url"
          id="imageUrl"
          value={imageUrl}
          errorText="Please enter a valid image url"
          handleChange={handleChange}
          isValid={formState.inputValidities.imageUrl}
          keyboardType="default"
          returnKeyLabel="next"
          required
        />
        {product?.price ? null : (
          <InputField
            label="Price"
            id="price"
            value={price}
            errorText="Please enter a valid price"
            handleChange={handleChange}
            keyboardType="decimal-pad"
            required
            min={0.1}
          />
        )}
        <InputField
          id="description"
          label="Description"
          value={description}
          errorText="Please enter a valid description"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          keyboardType="default"
          handleChange={handleChange}
          isValid={formState.inputValidities.description}
          required
          minLength={5}
        />
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
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
