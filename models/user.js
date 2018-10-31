const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === product._id.toString()
  );
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: 1 });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(p => p.productId._id.toString() !== productId);
  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
