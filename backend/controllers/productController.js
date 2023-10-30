const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErros = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors( async (req, res, next) => {

  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  })
})


// Get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors( async (req, res, next) => {

  const resPerPage = 4;
  const productCount = await Product.countDocuments()

  const apiFeatures = new APIFeatures(Product.find(), req.query)
          .search()
          .filter()
          .pagination(resPerPage)

  // const products = await Product.find();
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products
    // message: 'This route will show all products in database.'
  })
})

// Get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors( async (req, res, next) => {

  const product = await Product.findById(req.params.id);

  if(!product) {

    return next(new ErrorHandler('Product not found', 404));

    /* return res.status(404).json({
      success: false,
      message: 'Product not found'
    }) */
  }

  res.status(200).json({
    success: true,
    product
  })
})


// Update Product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors( async (req, res, next) => {

  let product = await Product.findById(req.params.id);

  if(!product) {
    return next(new ErrorHandler('Product not found', 404));

    /* return res.status(404).json({
      success: false,
      message: 'Product not found'
    }) */
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    sucess: true,
    product
  })

})

// Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors( async (req, res, next) => {

  const product = await Product.findById(req.params.id);

  if(!product) {
    return next(new ErrorHandler('Product not found', 404));
    
    /* return res.status(404).json({
      success: false,
      message: 'Product not found'
    }) */
  }

  await product.deleteOne();  // product.remove() -> (node:25280) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.

  res.status(200).json({
    success: true,
    message: 'Product is deleted.'
  })

})


// Create new review  =>  /api/v1/review
exports.createProductReview = catchAsyncErrors( async (req, res, next) => {
  
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    date: Date.now() // ngày review
  }

  const product = await Product.findById(productId);

  console.log(product.reviews);

  /* // Update review if already existed by user
  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )

  if(isReviewed) {
    product.reviews.forEach(review => {
      if(review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    })

  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  } */

  // thêm review mới vào danh sách
  product.reviews.push(review);

  // Tính lại số lượng reviews và trung bình đánh giá
  product.numOfReviews = product.reviews.length

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  })

})

// Get Product Reviews  =>  /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

// Delete Product Reviews  =>  /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
  
  const numOfReviews = reviews.length;

  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
})