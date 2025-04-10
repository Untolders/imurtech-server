# Contact Form Email Service

This Node.js application provides an email service using Express, Nodemailer, and Google reCAPTCHA to securely receive and forward contact form submissions.

## Features
- Receives form submissions via a POST request
- Sends emails using Nodemailer with Gmail
- Validates requests using Google reCAPTCHA
- Supports CORS for cross-origin requests

## Prerequisites
- Node.js installed
- A Gmail account for sending emails
- Google reCAPTCHA credentials

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file and add the following variables:
   ```env
   SENDER_EMAIL=your-email@gmail.com
   RECEIVER_EMAIL=receiver-email@example.com
   EMAIL_PASSWORD=your-email-password(app password)
   PORT=5000
   RECAPTCHA_SECRET=your-recaptcha-secret-key
   ```

## Usage
1. Start the server:
   ```sh
   node app.js
   ```

2. Endpoints:
   - **GET `/send-email`**: Test route to check server status.
   - **POST `/send-email`**: Submits a contact form and sends an email.

## Request Body Format (POST /send-email)
Send a JSON object with the following structure:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "contactNumber": "1234567890",
  "whatsapp": "1234567890",
  "subject": "Inquiry",
  "queryType": "General",
  "message": "Hello, I have a question!",
  "recaptchaToken": "your-recaptcha-token"
}
```

## Code Overview

### `app.js`
This file contains the main logic for handling form submissions and sending emails:
- Uses **Express** for handling requests
- Uses **Nodemailer** to send emails via Gmail
- Implements **Google reCAPTCHA** validation
- Defines two endpoints:
  - `GET /send-email`: Displays a welcome message
  - `POST /send-email`: Processes form submissions and sends an email

### `.env`
Stores sensitive credentials and configurations:
```env
SENDER_EMAIL=your-email@gmail.com
RECEIVER_EMAIL=receiver-email@example.com
EMAIL_PASSWORD=your-email-password
PORT=5000
RECAPTCHA_SECRET=your-recaptcha-secret-key
```

### Security Considerations
- Use **app passwords** instead of plain credentials for Gmail authentication.
- Never expose your `.env` file in public repositories.
- Use HTTPS in production for secure communication.

## License
This project is licensed under the MIT License.
