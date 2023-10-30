const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  ShippingInfo: {
    address: {
      type: String,
      require: true
    },
    city: {
      type: String,
      require: true
    },
    phoneNo: {
      type: String,
      require: true
    },
    postalCode: {
      type: String,
      require: true
    },
    country: {
      type: String,
      require: true
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  paymentInfo: {
    id : {
      type: String
    },
    status : {
      type: String
    }
  },
  paidAt: {
    type: Date
  },
  itemsPrice : {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus : {
    type: String,
    rquired: true,
    default: 'Processing'
  },
  deliveredAt: {
    type: Date
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Order', orderSchema)
