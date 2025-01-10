import dotenv from 'dotenv'

dotenv.config()

export default {
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    db: process.env.DB,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
        ATExpiresIn : process.env.JWT_AT_EXPIRES_IN,
        RTExpiresIn : process.env.JWT_RT_EXPIRES_IN,
        ATCookieExpiresIn : process.env.JWT_AT_COOKIE_EXPIRES_IN,
        RTCookieExpiresIn : process.env.JWT_RT_COOKIE_EXPIRES_IN,
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
}