# Chat App

A modern real-time chat application built with Next.js, MongoDB, and Tailwind CSS, inspired by WhatsApp.

## Features

- **User Authentication**: Register and login with email or Google account
- **Profile Management**: Update profile information, avatar, and privacy settings
- **Real-time Messaging**: Send and receive messages in real-time
- **Private & Group Chats**: Create one-on-one conversations and group chats
- **Message Types**: Support for text, images, audio, video, and files
- **User Search**: Find other users by name or email
- **Privacy Controls**: Make your account private or public
- **Online Status**: See when users are online or their last active time
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **API**: Next.js API Routes
- **Form Handling**: React Hooks

## Setup Instructions

### Prerequisites

- Node.js 16.8 or later
- MongoDB (local or Atlas)
- Google Developer Console project (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy the `.env.local.example` file to `.env.local`
   - Fill in the required environment variables:
     - MongoDB connection string
     - NextAuth secret
     - Google OAuth credentials (optional)

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
chat-app/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── (auth)/            # Authentication pages
│   │   ├── chat/              # Chat pages
│   │   ├── groups/            # Group management pages
│   │   ├── profile/           # Profile pages
│   │   ├── settings/          # Settings pages
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # React components
│   ├── lib/                   # Utility functions and MongoDB models
│   ├── hooks/                 # Custom React hooks
│   └── providers/             # React context providers
├── .env.local                 # Environment variables
└── ...                        # Configuration files
```

## Features to Add

- End-to-end encryption
- Read receipts
- Typing indicators
- Message reactions
- Voice and video calls
- Message search
- Dark/light theme toggle
- Notification settings
- Two-factor authentication

## License

MIT#   n i c h a t  
 