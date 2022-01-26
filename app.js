var express = require('express');
var app = express();

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyhJu13jNiP3qeJt'}).base('appwdRxjiToAELzWt');

//Default
app.get('/', function(req, res) {
  res.send("Library API");
});

//Get a book
app.get('/books/:id', function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  let book = [];

  base('Books').find(req.params.id, function(err, rec) {
      book.push({
        id: rec.id,
        title: rec.get('Titre'),
        image: rec.get('Cover'),
        authors : rec.get('Auteur(s)'),
        topics : rec.get('Topic'),
        rating: rec.get('Note'),
        notes: rec.get('Personal Notes'),
        place: rec.get('Où le trouver')
      });
      if (err) { console.error(err); return; }
      console.log("Get a book")
      res.json(book)
  });
});

//Get list of all books
app.get('/books', function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  let books = [];
  
  base('Books').select({
    view: "Galerie – Tous les livres"
  })
  .eachPage(function page(records, next) {
      records.forEach(function(rec) {
          try {
              books.push({
                id: rec.id,
                title: rec.get('Titre'),
                image: rec.get('Cover'),
                authors : rec.get('Auteur(s)'),
                topics : rec.get('Topic'),
                rating: rec.get('Note')
              });

          } catch (err) {
              console.error(err);
          }
      })
      try {
          next();
      } catch { return; }

  }, function (err) {
      if (err) {
          console.error(err);
          rej(err.statusCode);
          return;
      }
      console.log("Get all books!")
      res.json(books)
  });
});

//Get list of all authors
app.get('/authors', function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  let authors = [];
  
  base('Authors').select({
    view: "Table des auteurs"
  })
  .eachPage(function page(records, next) {
      records.forEach(function(rec) {
          try {
              authors.push({
                id: rec.id,
                name : rec.get('Name'),
                books : rec.get('Books')
              });

          } catch (err) {
              console.error(err);
          }
      })
      try {
          next();
      } catch { return; }

  }, function (err) {
      if (err) {
          console.error(err);
          rej(err.statusCode);
          return;
      }
      console.log("Get all authors!")
      res.json(authors)
  });
});



var server = app.listen(process.env.PORT || 8000, function () {  
  
  var host = server.address().address  
  var port = server.address().port  
  console.log("Example app listening at http://localhost:%s", port)  
  
})