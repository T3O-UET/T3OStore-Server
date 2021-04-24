// JSON WEB TOKEN 
// Check token 
const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked //User Role
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/  , methods: ['GET','OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/  , methods: ['GET','OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/  , methods: ['GET','OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/users/changePassword`,
            `${api}/users/updateUser`,
            `${api}/users/getCurrentUser`,
        ]
    })
}

async function isRevoked(req, payLoad, done){
    if(!payLoad.isAdmin){
        done(null, true)
    }
    done();
}
module.exports = authJwt;