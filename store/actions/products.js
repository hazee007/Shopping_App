export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const deleteProduct = (productId) => ({
  type: DELETE_PRODUCT,
  id: productId,
});

export const createProduct = (product) => ({
  type: CREATE_PRODUCT,
  productData: product,
});

export const updateProduct = (id, product) => ({
  type: UPDATE_PRODUCT,
  pid: id,
  productData: product,
});
