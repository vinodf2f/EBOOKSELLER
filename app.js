const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')('sk_test_d4PTrsMOFwM2Q7UsBOKVFlt3');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//Handlebars middlewares
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static folder
app.use(express.static(`${__dirname}/public`));

//Index Route

app.get('/', (req,res) =>
{
    res.render('index',
{
    stripePublishableKey: keys.stripePublishableKey
});
});

//charge route

app.post('/charge', (req, res)=>
{
    const amount = 2500;
    stripe.customers.create(
        {
            email : req.body.stripeEmail,
            source : req.body.stripeToken
        }
    )
    .then(customer => stripe.charges.create({
        amount,
        description : 'Web Ebook',
        currency:'usd',
        customer : customer.id
    }))
    .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
{
    console.log(`server started on port ${port}`);
});