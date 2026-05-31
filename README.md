# Brother FC - Football Mastery 🎯

An AI-powered football training application for mastering dribbling, tactics, and fitness with PWA support for web and mobile app installation.

## Features

✅ **Daily Training Programs** - Personalized football training routines  
✅ **Progress Tracking** - Monitor your XP, level, and streak  
✅ **User Analytics** - Track login history and activity  
✅ **Email Notifications** - Get registration confirmations and admin alerts  
✅ **PWA Support** - Install as a web app or APK on mobile devices  
✅ **Admin Dashboard** - View user statistics and analytics  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Email**: Nodemailer (Gmail)
- **PWA**: Vite PWA Plugin, Service Workers
- **Database**: JSON File (local storage)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Gmail account with App Password (for email notifications)
- Gemini API key (optional, for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asifali8855-hub/BrotherFCforfootball.git
   cd BrotherFCforfootball
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your settings:
   ```env
   GEMINI_API_KEY=your_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Training
- `GET /api/training/daily?userId=<id>` - Get daily training
- `POST /api/training/complete` - Mark training as complete

### Analytics
- `GET /api/stats` - Get global statistics
- `GET /api/user/:userId/history` - Get user history and activity
- `GET /api/admin/users-summary` - Get all users summary (admin)

## Installing as Web App / APK

### Web App Installation
1. Open the app in Chrome/Edge/Firefox
2. Click the install button or use browser menu → Install app
3. Access the app from your home screen

### Android APK Generation
1. Build the PWA: `npm run build`
2. Use [PWA Builder](https://www.pwabuilder.com/) or [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
3. Upload the built files to generate APK

## Email Configuration

To enable email notifications:

1. Enable 2FA on your Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Set `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`
4. Admin will receive alerts at `asifali8855@gmail.com`

## Admin Dashboard

Access admin features at `/admin` to view:
- Total registered users
- Active users today
- User registration history
- Login patterns and activity

## Performance Monitoring

Track user engagement:
- **Daily Active Users** - Users who logged in today
- **Total Registrations** - All-time user count
- **User Activity Log** - Detailed user actions and timestamps
- **Email Notifications** - Alerts for new registrations

## Project Status

- ✅ Core training features
- ✅ User authentication and history
- ✅ Email notifications
- ✅ PWA support
- ✅ Admin analytics
- 🔄 Mobile app optimization
- 🔄 Advanced AI coaching

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Educational use only. See LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [BrotherFCforfootball/issues](https://github.com/asifali8855-hub/BrotherFCforfootball/issues)
- Email: asifali8855@gmail.com

## Roadmap

- [ ] Advanced AI coaching with Gemini
- [ ] Video upload for technique analysis
- [ ] Social features and leaderboards
- [ ] Integration with fitness trackers
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Offline mode improvements

---

**Made with ⚽ for Football Enthusiasts**
