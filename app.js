const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const { authJwt } = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

//config 
require('dotenv/config');
const api = process.env.API_URL;
const conn = process.env.CONNECTION_STRING

//Apply cors
app.use(cors());
app.options('*', cors())

//middleware 
app.use(express.json())
app.use(morgan('tiny'));
//Người dùng đăng nhập vào dùng token được tạo ra mới có thể truy cập vào các API
app.use(authJwt());
// Quản lý error
app.use(errorHandler);

// Routes
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Connect database
mongoose.connect(conn,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Eshop-database',
    })
    .then(() => {
        console.log('database connection is ready...')
        app.listen(3000, () => console.log(' server is running http://localhost:3000'));
    })
    .catch(err => {
        console.log(err);
    })

//Server
app.listen(3000, ()=>console.log(' server is running http://localhost:3000'));

//Production
var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("Express is working on port " + port)
})