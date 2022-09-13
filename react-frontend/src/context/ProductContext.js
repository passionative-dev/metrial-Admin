import React from 'react';
import axios from 'axios';
const ProductsContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCTS':
      return {
        isLoaded: true,
        products: action.payload,
      };
    case 'EDIT_PRODUCT':
      const index = action.payload.id;
      return {
        ...state,
        isLoaded: true,
        products: state.products.map((c) => {
          if (c.id === index) {
            return { ...c, ...action.payload };
          }
          return c;
        }),
      };
    case 'CREATE_PRODUCT':
      state.products.push(action.payload);
      return {
        ...state,
        isLoaded: true,
        products: state.products,
      };

    default:
      return {
        ...state,
      };
  }
};

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = React.useReducer(rootReducer, {
    isLoaded: false,
    products: [],
  });
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProductsState = () => {
  const context = React.useContext(ProductsContext);
  return context;
};

export function getProductsRequest(dispatch) {
  return axios.get('/products').then((res) => {
    dispatch({
      type: 'UPDATE_PRODUCTS',
      payload: res.data.map((product) => ({
        ...product,
        extraValues: JSON.parse(product.extraValues),
      })),
    });
  });
}

export function deleteProductRequest({ id, history, dispatch }) {
  if (Array.isArray(id)) {
    for (let key in id) {
      axios.delete('/products/' + id[key]).then((res) => {});
    }
  } else {
    axios.delete('/products/' + id).then((res) => {
      getProductsRequest(dispatch);
      if (history.location.pathname !== '/app/ecommerce/management') {
        history.push('/app/ecommerce/management');
      }
      return;
    });
  }
  getProductsRequest(dispatch);
}

export function updateProduct(product, dispatch, history) {
  axios
    .put('/products/' + product.id, {
      ...product,
      extraValues: JSON.stringify(product.extraValues),
    })
    .then((res) => {
      dispatch({ type: 'EDIT_PRODUCT', payload: res.data });
    });
}

export function createProduct(product, dispatch, history) {
  axios
    .post('/products', {
      ...product,
      extraValues: JSON.stringify(product.extraValues),
    })
    .then((res) => {
      dispatch({ type: 'CREATE_PRODUCT', payload: res.data });
    })
    .then(() => {
      history.push('/app/ecommerce/management');
    });
}

export { ProductsProvider, ProductsContext, useProductsState };
