// Model works with the database

const mongoose = require("mongoose");

// Define the schema for the Home model, it's a blueprint for the data
const HomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

// Create the Home model using the schema, it's a collection of documents
const HomeModel = mongoose.model("Home", HomeSchema);

// Export the Home model
module.exports = HomeModel;
