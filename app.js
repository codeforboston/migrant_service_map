const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Index.html');
});

app.get('/map', (req, res) => {
  res.sendFile(__dirname + '/msmmain.html');
});


app.get(/^(.+)$/, (req, res, next) => { 
  res.sendFile(__dirname + req.params[0], (err) => {
    if (err) {
      
      res.status(404).send("URL Not Found, visit the <a href='/map'>map</a> instead")
      next(err);
    }
  }); 
});

/*
app.use(function (req, res, next) {
  res.status(404).send("404 Not Found")
})
*/

app.listen(port, () => {
  console.log(`Express application running at localhost:${port}`);
});
