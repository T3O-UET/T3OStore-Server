const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET ALL
router.get(`/`, async (req, res) => {

    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})
// GET BY ID
router.get('/:id', async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
})
// CREATE
router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')
    const file = req.file;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);
})

// UPDATE
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    );

    if (!product)
        return res.status(500).send('The product cannot be updated')

    res.send(product);
})



// DELETE
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({ success: true, message: 'The product deleted!' })
            } else {
                return res.status(404).json({ success: false, message: 'The product not found' })
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
})

// GET PRODUCT COUNT
router.get('/get/count', async (req, res) => {


    const productCount = await Product.countDocuments((count) => count)


    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    });
})


module.exports = router;