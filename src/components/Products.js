import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");
  const [productDetails, setProductDetails] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [debounceTime, setDebounceTime] = useState(0);
  const username = localStorage.getItem("username");
  const [cartLoad, setCartLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  // const history = useHistory();

  useEffect(() => {
    performAPICall();
  }, []);

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${config.endpoint}/products`);
      setProductDetails(response.data);
      // setProducts(response.data);
      setFilteredProduct(response.data);
      setCartLoad(true);
      // console.log(response.data);
    } catch (error) {
      handleAPIError(error);
    }
    setIsLoading(false);
  };

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    try {
      let response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProduct(response.data);
      // console.log(text);
    } catch (error) {
      handleSearchError(error, text);
    }
    setIsLoading(false);
  };

  const handleAPIError = (error) => {
    if (error.response && error.response.status === 400) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  const handleSearchError = (error, text) => {
    if (error.response) {
      if (error.response.status === 404) {
        setFilteredProduct([]);
      }
      if (error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        setFilteredProduct(productDetails);
      }
    } else {
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeId) => {
    const text = event.target.value;
    if (debounceTimeId) {
      clearTimeout(debounceTimeId);
    }
    const newTimeOut = setTimeout(() => {
      performSearch(text);
    }, 500);
    setDebounceTime(newTimeOut);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setCartItem(generateCartItemsFrom(response.data, productDetails));
      }
    } catch (e) {
      handleAPIError(e);
    }
  };

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);

  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // for (let i = 0; i < items.length; i++) {
    //   if (items[i].productId === productId) {
    //     return true;
    //   }
    // }
    // return false;
    return items.some((item) => item.productId === productId);
  };

  const addInCart = async (productId, qty) => {
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItem(generateCartItemsFrom(response.data, productDetails));
    } catch (e) {
      handleAPIError(e);
    }
  };

  const handleQuantity = (productId, qty) => {
    addInCart(productId, qty);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    // qty,
    options = { preventDuplicate: false }
  ) => {
    const {qty =1, preventDuplicate =false} = options;
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "error",
      });
      return;
    }

    // if (isItemInCart(items, productId) && options.preventDuplicate) {
    //   enqueueSnackbar(
    //     "Item already in cart. Use the cart sidebar to update quantity or remove item.",
    //     {
    //       variant: "warning",
    //     }
    //   );
    //   return;
    // }

    if (token) {
      if(isItemInCart(items, productId)){
        enqueueSnackbar(
         "Item already in cart. Use the cart sidebar to update quantity or remove item.",
         {
           variant: "warning",
         }
       );
      }
      else{
         addInCart(productId,qty);
      }
    }

    try {
      await addInCart(productId, qty);
    } catch (e) {
      handleAPIError(e);
    }
  };

  const handleCart = (productId) => {
    addToCart(token, cartItem, productDetails, productId);
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          style={{ width: "50%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTime)}
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTime)}
      />

      <Grid container>
        <Grid
          item
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          xs
          md
        >
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          {isLoading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ margin: "auto" }}
              py={10}
            >
              <CircularProgress size={30} />
              <Typography variant="h4" color="textSecondary">
                Loading Products
              </Typography>
            </Box>
          ) : (
            <Grid
              container
              item
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="center"
              my={3}
            >
              {filteredProduct.length ? (
                filteredProduct.map((product) => (
                  <Grid
                    item
                    key={product["_id"]}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={6}
                    mt={2}
                    mb={2}
                  >
                    <ProductCard
                      product={product}
                      handleAddToCart={() => handleCart(product["_id"])}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  py={10}
                  sx={{ margin: "auto" }}
                >
                  <SentimentDissatisfied size={40} />
                  <Typography variant="h6" color="textSecondary">
                    No products found
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>

        {username && (
          <Grid
            container
            item
            sm={12}
            xs={12}
            md={3}
            style={{ backgroundColor: "#E9F5E1" }}
            justifyContent="center"
          >
            <Cart
              products={productDetails}
              items={cartItem}
              handleQuantity={handleQuantity}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
