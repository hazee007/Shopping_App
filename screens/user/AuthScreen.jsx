import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Card from "../../components/Card";
import InputField from "../../components/InputField";
import { Colors } from "../../utils";
import { useDispatch } from "react-redux";
import { login, signUp } from "../../store/actions/auth";

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

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

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

  const { email, password } = formState.inputValues;

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = signUp(email, password);
    } else {
      action = login(email, password);
    }
    setError(null);
    setLoading(true);
    try {
      await dispatch(action);
      navigation.navigate("Shop");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.container}>
          <ScrollView>
            <InputField
              id="email"
              label="Email"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              initialValue=""
              handleChange={handleChange}
            />
            <InputField
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password"
              initialValue=""
              handleChange={handleChange}
            />
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => setIsSignUp(!isSignUp)}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </View>
  );
}

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
