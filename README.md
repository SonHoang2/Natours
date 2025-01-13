# Natours

# Overview
The purpose of this project is to design and develop a functional website that will allow users to book tours to travel.

## Technologies
- Front End: React, HTML, CSS, Bootstrap, JavaScript
- Back End: NodeJS, Express
- Database: MongoDB
- Architectural Pattern: MVC

## Features 
- **User Authentication and Authorization:** Ensures secure login, registration, password management, RBAC-based access control, Google login for bookings, and session management with Access and Refresh Tokens.

- **User Profile Management:** Enables users to update account details, view bookings and reviews, and manage roles from regular user to admin, lead guide, and guide.

- **Tour Management:** Enables users to view tours with details like maps, reviews, and ratings, while admins and lead guides can create, update, and delete tours.

- **Booking Management:** Lets regular users book tours (with restrictions against duplicate bookings), view their booked tours, and grants admins access to manage all bookings on the platform.

- **Review Management:** Allows regular users to write, edit, or delete reviews for tours they have booked (with restrictions against duplicate reviews), while admins can delete any review, and all reviews are visible to users.

- **Payment Processing:** Supports secure credit card payment processing for booking tours.
  
## Security Measures
- **Password Hashing**: Uses bcrypt to securely hash passwords, preventing unauthorized access to user accounts.
- **JWT Authentication**: Implements JSON Web Tokens for secure user authentication and authorization.
- **XSS Protection**: Guards against Cross-Site Scripting attacks by sanitizing user input and output.
- **Rate Limiting**: Limits the number of requests per user to prevent abuse and protect against DDoS attacks.
- **Secure Cookies**: Sets the `Secure`, `HttpOnly`, and `SameSite` flags on cookies to prevent session hijacking and cookie theft.
- **CORS Protection**: Prevents unauthorized access to resources by enforcing strict CORS policies.
- **NoSQL Injection Prevention**: Uses Mongoose to sanitize and validate user input to prevent NoSQL injection attacks. Escapes special characters and uses parameterized queries to prevent NoSQL injection attacks.
- **File Upload Security**: Validates file types and sizes to prevent malicious file uploads.
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

JWT_SECRET=your jwt secret
JWT_AT_EXPIRES_IN=1h
JWT_RT_EXPIRES_IN=7d
JWT_AT_COOKIE_EXPIRES_IN=1
JWT_RT_COOKIE_EXPIRES_IN=7

EMAIL_HOST=smtp.gmail.com
EMAIL_USERNAME=your gmail
EMAIL_PASSWORD=your gmail application password

STRIPE_SECRET_KEY=your stripe secret key
```

## Author
Hi, I'm the creator and maintainer of this project. I'm passionate about software development and always eager to improve. If you find this project helpful, please consider giving it a star ⭐ – your support means a lot!  

If you encounter any bugs or issues, feel free to report them via email. I appreciate your feedback!  

📧 **Email:** naruto3285@gmail.com
