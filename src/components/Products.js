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

  const fetchCart = async (token) => {
    if (!token) return;
    try {
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

  const addToCart = async (
    token,
    items,
    products,
    productId,
    // qty,
    options = { preventDuplicate: false }
  ) => {
    const { qty = 1, preventDuplicate = false } = options;
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
      if (isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      } else {
        addInCart(productId, qty);
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
