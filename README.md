<p align="center" style="font-size: 30px">
Natours
</p>

<p align="center">
The purpose of this project is to design and develop a functional website that will allow users to book tours to travel.
</p>


## Technology Using
- Front End: React, HTML, CSS, Bootstrap, JavaScript
- Back End: NodeJS, Express
- Database: MongoDB
- Architectural Pattern: MVC

## Key Features 
- Authentication and Authorization:
    - Using RBAC for authorization
    - Users can sign up, log in, log out, update, and reset passwords
    - Users can utilize Google accounts for booking tours.

- User profile
    - Users can update their username, photo, email, password, and other information. They can also view bookings and reviews. 
    - User roles range from regular user, admin, lead guide, to guide, with the default status set as regular user upon signup.

- Tour Management
    - Allows users to manage bookings, check tour maps, and view users' reviews and ratings.
    - Tours can be created by an admin user or a lead guide.
    - Every user has access to view tours.
    - Admin users or lead guides can update, and delete tours.

- Bookings
    - Only regular users can book tours
    - Regular users can not book the same tour twice.
    - Regular users can see all the tours they have booked.
    - An admin user can see every booking on the app.

- Reviews
    - Only regular users can write reviews for tours that they have booked.
    - All users can see the reviews of each tour.
    - Regular users can edit and delete their reviews.
    - Regular users can not review the same tour twice.
    - An admin can delete any review.

- Payment
    - Users can pay with a credit card. 

## How To Payment

- Login to the site
- Search for tours that you want to book
- Book a tour
- Proceed to the payment checkout page
- Enter the card details (Test Mood):

  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 04 / 44
  - CVV: 444
  ```
- Finished!

## Setting Up Your Local Environment 
- File `.env` located in the client folder

```
REACT_APP_CLIENT_URL=your client link
REACT_APP_SERVER_URL=your server link 
REACT_APP_GOOGLE_CLIENT_ID=your google id
```

- File `config.env` located in the server folder

```
CLIENT_URL=your client link
SERVER_URL=your server link
NODE_ENV=development or production
PORT=5000
DB=your mongodb link

GOOGLE_CLIENT_ID=your google id
GOOGLE_CLIENT_SECRET=your secret google id

JWT_SECRET= your JSON web token secret (I recommend string with at least 32 characters for Security)
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_HOST=smtp.gmail.com
EMAIL_USERNAME=your gmail
EMAIL_PASSWORD=your gmail application password

STRIPE_SECRET_KEY=your stripe secret key
```

## About the Author

Hi, I'm the creator and maintainer of this project. I'm passionate about software development and always eager to improve. If you find this project helpful, please consider giving it a star ⭐ – your support means a lot!  

If you encounter any bugs or issues, feel free to report them via email. I appreciate your feedback!  

📧 **Email:** naruto3285@gmail.com
