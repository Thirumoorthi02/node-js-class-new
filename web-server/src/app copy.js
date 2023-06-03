const express = require('express')
const http = require('http')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const router = express.Router();
const port = process.env.PORT || 3000

http.createServer( (req, res)=> {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('\nHello World!');
  res.write('\nHello World!');
  res.write('\nHello World!');
    console.log(res)
  let i = 0;
  const x = setInterval(()=>{
    res.write('\n Hey there');
    i++;
    if(i === 10){
        clearInterval(x);
        res.end();
    }
  },2000)
}).listen(8080);

router.get('/123',(req,res,next)=>{
    next();
    console.log(1234)
})

router.get('/123',(req,res,next)=>{
    next();
    console.log("1234abc")
})

// Setup static directory to serve
app.use(router)

app.get('/123',(req,res)=>{
    console.log(4568)
    res.send("<h1>Hey there</h1>");
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Andrew Mead'
    })
})


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})