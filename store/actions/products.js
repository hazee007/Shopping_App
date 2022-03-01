import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const response = await fetch(
        "https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }
      const resData = await response.json();
      const loadedProducts = [];
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCT,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(
        `https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products/${productId}.json?=auth=${token}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network Error");
      }
      dispatch({
        type: DELETE_PRODUCT,
        id: productId,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const createProduct = (product) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      console.log(token);
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...product, ownerId: userId }),
        }
      );

      const resData = await response.json();
      if (resData.error) {
        console.log(resData.error);
        throw new Error("Network Error");
      } else {
        console.log(resData);
      }
      dispatch({
        type: CREATE_PRODUCT,
        productData: { ...product, id: resData.name, ownerId: userId },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateProduct = (id, product) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(
        `https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: product.title,
            description: product.description,
            imageUrl: product.imageUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }
      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: product,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
