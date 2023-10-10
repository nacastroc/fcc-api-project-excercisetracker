const mongoose = require('mongoose')
const { Schema } = mongoose
const exerciseSchema = require('./excercise.model').schema

const schema = new Schema({
  username: { type: String },
  exercises: {
    type: [exerciseSchema],
    alias: 'log'
  }
});

const model = mongoose.model('User', schema);

module.exports = { schema, model }