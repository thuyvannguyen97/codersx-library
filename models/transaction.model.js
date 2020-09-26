const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  isComplete: Boolean,
});

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;