const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Joi = require("joi");
const app = express();
require("dotenv").config();
const uuid = require('uuid');
const validate = require('uuid-validate');


app.use(cors());
app.use(bodyParser.json());

/**
 * Static JSon
 */
const cartJson = [
  {
    id:uuid.v4(),
    name: "product01",
    description: "Hello Cart",
    price: 100,
    quantity: 1,
  },
  {
    id: uuid.v4(),
    name: "product02",
    description: "Hello Cart 012",
    price: 200,
    quantity: 2,
  },
  {
    id: uuid.v4(),
    name: "product03",
    description: "Hello Cart 013",
    price: 300,
    quantity: 3,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "cart data -  I-Shop",
  });
});

/**
 * Get Cart Items
 */
app.get("/api/items", (req, res) => {
  res.send(cartJson);
});
/**
 * Get Cart Item By Id
 */
app.get("/api/items/:id", (req, res) => {
    const validatedId = validate(req.params.id);
    if(!validatedId){
        res.status(400).send("The Id is not a valid UUID");
        return;
    }else{
        const cartItem = cartJson.find((c) => c.id === req.params.id);
        if (!cartItem) {
          res.status(404).send("The cart Item not found");
        } else {
          res.send(cartItem);
        }
    }
  
});

/**
 * Post Cart Item
 */

app.post("/api/items", (req, res) => {

  const { error } = validateCart(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  } else {
    const cartItem = {
      id: uuid.v4(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
    };
    cartJson.push(cartItem);
    res.send(cartJson);
  }
});
/**
 * Update Cart Item
 */
app.put("/api/items/:id", (req, res) => {
    if(!validatedId){
        res.status(400).send("The Id is not a valid UUID");
        return;
    }else{
        const cartItem = cartJson.find((c) => c.id === req.params.id);
        if (!cartItem) {
          res.status(404).send("The item not found");
          return;
        }
        const { error } = validateCart(req.body);
        if (error) {
          res.status(400).send(error);
          return;
        } else {
          cartItem.name = req.body.name;
          cartItem.description = req.body.description;
          cartItem.price = req.body.price;
          cartItem.quantity = req.body.quantity;
          res.send(cartItem);
        }
    }
  
});
/**
 * Delete Cart Item
 */
app.delete("/api/items/:id", (req, res) => {
    if(!validatedId){
        res.status(400).send("The Id is not a valid UUID");
        return;
    }else{
        const cartItem = cartJson.find((c) => c.id === req.params.id);
        if (!cartItem) {
          res.status(404).send("The Item not found");
          return;
        }
        const index = cartJson.indexOf(cartItem);
        cartJson.splice(index, 1);
        res.send(cartItem);
    }
  
});
/**
 * Validate Cart Item
 * @param {*} cart
 * @returns
 */
function validateCart(cart) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(100).required(),
    price: Joi.required(),
    quantity: Joi.required(),
  });

  return schema.validate(cart);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Application is running on ${port}`);
});
