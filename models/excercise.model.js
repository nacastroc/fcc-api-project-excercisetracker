const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  description: { type: String },
  duration: { type: Number },
  date: { type: Date }
}, { _id: false });

module.exports = { schema: schema }