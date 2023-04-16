const router = require('express').Router();
const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.post('/create-tokens', async (req, res, next) => {
  try {
    const { code } = req.body;
    const {tokens} = await oauth2Client.getToken(code)
    res.send(tokens); 
  } catch (error) {
    next(error)
  }
});

router.post('/create-event', async(req, res, next) => {
  try {
    const {summary, description, location, startDateTime, endDateTime} = req.body;
    oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN});
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: '7',
        start: {
          dateTime: new Date(startDateTime)
        },
        end: {
          dateTime: new Date(endDateTime)
        }
      }
    })
    res.send(response);
  } catch (error) {
    console.log(error.message);
    next(error)
  }
})

module.exports = router;
