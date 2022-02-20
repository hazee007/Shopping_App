import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
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
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      // console.log(resData);
      dispatch({
        type: SET_PRODUCT,
        products: loadedProducts,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products/${productId}.json`,
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
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error("Network Error");
      }
      const resData = await response.json();
      console.log(resData);
      dispatch({
        type: CREATE_PRODUCT,
        productData: { ...product, id: resData.name },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const updateProduct = (id, product) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://rn-complete-guide-e7d6d-default-rtdb.firebaseio.com/products/${id}.json`,
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
