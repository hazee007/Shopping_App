import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const AUTHENTICATE = "AUTHENTICATE";

const api = "AIzaSyB0bZ-5DEsdXsTaa4cmxHuU9SBHG7KiQE4";

export const authenticate = (userId, token, expiryTime) => {
  return async (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId, token });
  };
};

export const signUp = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const resData = await response.json();
      if (resData.error) {
        const errorMessage = resData.error.message;
        let message = "Something went wrong!";
        if (errorMessage === "EMAIL_EXIST") {
          message = "This email already exist";
        }
        throw new Error(message);
      } else {
        // console.log(resData);
      }
      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn * 1000)
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn * 1000)
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      throw new Error(error.message);
    }
  };
};
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );

      const resData = await response.json();
      if (resData.error) {
        const errorMessage = resData.error.message;
        let message = "Something went wrong!";
        if (errorMessage === "EMAIL_NOT_FOUND") {
          message = "This email address does not exist";
        } else if (errorMessage === "INVALID_PASSWORD") {
          message = "Invalid password";
        }
        throw new Error(message);
      } else {
        // console.log(resData);
      }
      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn * 1000)
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn * 1000)
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      throw new Error(error.message);
    }
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

let timer;

export const logOut = () => {
  return async (dispatch) => {
    clearLogoutTimer();
    await AsyncStorage.removeItem("userData");
    dispatch({ type: LOGOUT });
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  LogBox.ignoreAllLogs();
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logOut());
    }, expirationTime);
  };
};
