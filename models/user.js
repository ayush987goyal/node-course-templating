const ObjectID = require('mongodb').ObjectID;
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = ObjectID(id);
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: ObjectID(product._id), quantity: 1 });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .catch(console.log);
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString())
              .quantity
          };
        });
      })
      .catch(err => console.log(err));
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      p => p.productId.toString() !== productId.toString()
    );

    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } } })
      .catch(console.log);
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.username
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
          .catch(console.log);
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': this._id })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: ObjectID(userId) })
      .catch(err => console.log(err));
  }
}

module.exports = User;
