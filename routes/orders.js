const { authenticateJWT } = require('../helpers/jwt')
const { Order } = require('../models/order');
const { Product } = require('../models/product');

const express = require('express');
const { Types } = require('mongoose');


const router = express.Router();

//GET ALL
router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').populate('products.product').sort({ 'dateOrdered': 1 })

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

//GET BY ID
router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
})


router.post('/',  async (req, res) => {
   
    // try {
        /* Note 
            body.products = {
                productId: string
                quantity: number
            }
        */
        const user = req.user
        // console.log(user)
        var totalPrice = 0;

        const listOrderProducts = req.body.products;
        // console.log(listOrderProducts)

        const productIds = Array.from(new Set(listOrderProducts.map(
            value => {
                return value.product.id
            }
            )));


        const products = await Product.find({ _id: { $in: productIds } });
        const orderProducts = [];

        for (let i = 0; i < listOrderProducts.length; i++) {
            const product = products.find(val => val.id == Types.ObjectId(listOrderProducts[i].product.id))
           
            totalPrice += product.price * listOrderProducts[i].quantity;
            // console.log(product)
            orderProducts.push({
                quantity: listOrderProducts[i].quantity,
                product: product
            });
        }

        const order = new Order({
            products: orderProducts,
            totalPrice: totalPrice,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            phone: req.body.phone,
            status: req.body.status,
            user: req.body.user
        });
        await order.save();
        // if(!order){
        //     return res.status(400).send('the order cannot be created')
        // }
                
        return res.status(200).send(order);
    // } catch(error) {
    //     next(error)
    // }
   
})

// UPDATE ORDER
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    )
        ;
    if (!order)
        return res.status(404).send('The order cannot be updated!');
    res.send(order);
})

// DELETE
router.delete('/:id', authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const order = await Order.findOne({ _id: req.params.id });
        if (order.user == String(user._id)) {
            await Order.deleteOne({ _id: req.params.id });
            return res.status(200).send("Delete complete");
        }
        return res.status(403).send("Fail");
    } catch (error) {
        next(error)
    }
})

module.exports = router;