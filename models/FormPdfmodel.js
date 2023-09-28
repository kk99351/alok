const mongoose = require("mongoose");

const FormPdfmodel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  citizen: {
    type: String,
    required: true,
  },
  srcCountry: {
    type: String,
    required: true,
  },
  dstCountry: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Formpdfs", FormPdfmodel);