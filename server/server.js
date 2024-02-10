const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.DB)
  .then(() => console.log('DB connection successfull'))

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// test 
// const fs = require('fs');
// const Tour = require('./models/tourModel')
// const User = require('./models/userModel')
// const Review = require('./models/reviewModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf8'));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf8'));

// const importData = async () => {
//   try {
//     // await Tour.create(tours);
//     await User.create(users);
//     // await Review.create(reviews);
//     console.log('Data successfully created');
//   } catch (err) {
//     console.log(err);
//   }
// }

// const deleteData = async () => {
//   try {
//     // await Tour.deleteMany();
//     await User.deleteMany();
//     // await Review.deleteMany();
//     console.log('Data successfully deleted');
//   } catch (err) {
//     console.log(err);
//   }
// }

// if (process.argv[2] === '--import') {
//   importData();
// }

// if (process.argv[2] === '--delete') {
//   deleteData();
// }

