import { Text, TextInput, StyleSheet, View } from "react-native";
import React, { useEffect, useReducer } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case "INPUT_BLUR":
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

export default function InputField(props) {
  const { label, id, value, handleChange, isValid, errorText } = props;

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: value ?? "",
    isValid: isValid,
    touched: false,
  });

  useEffect(() => {
    if (inputState.touched) {
      handleChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, handleChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: "INPUT_CHANGE", value: text, isValid });
  };

  const lostFocus = () => {
    dispatch({ type: "INPUT_BLUR" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labels}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocus}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  errorContainer: {
    margin: 5,
  },
  errorText: { fontFamily: "open-sans", color: "red", fontSize: 13 },
});
