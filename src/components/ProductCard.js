import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  // const { _id, name, category, cost, rating, image } = product;
  return (
    <Card className="card" sx={{maxWidth:385}}>
      <CardMedia
        component="img"
        alt={product.name}
        height="240"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        {/* <Button
          size="small"
          fullWidth
          color="primary"
          variant="contained"
          onClick={() => handleAddToCart(product._id)}
          startIcon={<AddShoppingCartOutlined />}
        >
          ADD TO CART
        </Button> */}

        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={(e)=>handleAddToCart()}
          className="card-button"
        >
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
