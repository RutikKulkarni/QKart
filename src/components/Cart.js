import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Divider } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  const cartItems = [];

  if (cartData.length && productsData.length) {
    for (const cartItem of cartData) {
      const matchedProduct = productsData.find(
        // (products) => product._id === cartItem.product._Id
        (product) => product._id === cartItem.productId
      );
      if (matchedProduct) {
        const mergedCartItem = { ...matchedProduct, ...cartItem };
        cartItems.push(mergedCartItem);
      }
    }
  }
  return cartItems;
  // console.log("cartData :",cartData);
  // console.log("productsData :",productsData);
};

const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

let OrderDetailsView = ({ items = [] }) => {
  return (
    <Box className="cart">
      <Box display="flex" flexDirection="column" padding="1rem">
        <Box>
          <h2>Order Details</h2>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box>
            <p>Product</p>
            <p>Subtotal</p>
            <p>Shipping Charges</p>
            <h3>Total</h3>
          </Box>

          <Box style={{ textAlign: "right" }}>
            <p>{items.length}</p>
            <p>${getTotalCartValue(items)}</p>
            <p>$0</p>
            <h3>${getTotalCartValue(items)}</h3>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Cart = ({ products, items = [], handleQuantity, isReadOnly = false }) => {
  const history = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <Box
          key={item._id}
          display="flex"
          alignItems="flex-start"
          padding="1rem"
        >
          <Box className="image-container">
            <img src={item.image} alt={item.name} width="100%" height="100%" />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
          >
            <div>{item.name}</div>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {isReadOnly ? (
                <Box style={{ fontSize: "1rem" }}>Qty: {item.qty}</Box>
              ) : (
                <ItemQuantity
                  value={item.qty}
                  handleAdd={() => handleQuantity(item.productId, item.qty + 1)}
                  handleDelete={() =>
                    handleQuantity(item.productId, item.qty - 1)
                  }
                />
              )}
              <Box padding="0.5rem" fontWeight="700">
                ${item.cost}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box color="#3C3C3C" alignSelf="center">
          Order total
        </Box>
        <Box
          color="#3C3C3C"
          fontWeight="700"
          fontSize="1.5rem"
          alignSelf="center"
          data-testid="cart-total"
        >
          ${getTotalCartValue(items)}
        </Box>
      </Box>
      <Divider />
      {isReadOnly ? (
        <OrderDetailsView items={items} />
      ) : (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              history.push("/checkout");
            }}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
