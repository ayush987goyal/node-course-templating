const ObjectID = require('mongodb').ObjectID;
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .catch(err => console.log(err));
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
