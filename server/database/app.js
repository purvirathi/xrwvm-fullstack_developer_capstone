const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const dealershipsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8')
);
const reviewsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);

const dealerships = dealershipsData.dealerships;
const reviews = reviewsData.reviews;

// Express route to home
app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  res.json(reviews);
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  const documents = reviews.filter((review) => review.dealership === dealerId);
  res.json(documents);
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  res.json(dealerships);
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  const documents = dealerships.filter(
    (dealership) => dealership.state === req.params.state
  );
  res.json(documents);
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  const documents = dealerships.filter(
    (dealership) => dealership.id === dealerId
  );
  res.json(documents);
});

// Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const maxId = reviews.reduce((currentMax, review) => {
      return Math.max(currentMax, review.id);
    }, 0);
    const savedReview = {
      id: maxId + 1,
      name: data.name,
      dealership: Number(data.dealership),
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: Number(data.car_year),
    };

    reviews.push(savedReview);
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
