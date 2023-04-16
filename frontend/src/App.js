import { GoogleLogin } from 'react-google-login';
import './App.css';
import { gapi } from "gapi-script";
import { useEffect, useState } from 'react';
import axios from 'axios'

function App() {
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)

  const onSuccess = (res) => {
    const { code } = res;
    axios.post('/api/create-tokens', { code })
      .then(result => {
        console.info(result.data);
        setIsSignedIn(true);
      })
      .catch(err => console.error(err))
  }

  const onFailure = (res) => {
    console.error(res);
  }

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: '794606318486-ftfo3bu412npnknf03rbgavstvh6a75t.apps.googleusercontent.com',
        scope: 'openid email profile https://www.googleapis.com/auth/calendar',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('/api/create-event', {
      summary, description, location, startDateTime, endDateTime
    }).then(response => console.log(response.data))
      .catch(error => console.log(error.message))
  }


  return (
    <div>
      <div className="App">
        <h1>Google Calendar API</h1>
      </div>
      {
        !isSignedIn ? (
          <div>
            <GoogleLogin
              clientId='794606318486-ftfo3bu412npnknf03rbgavstvh6a75t.apps.googleusercontent.com'
              buttonText='Sign In && Authorize Google Calendar'
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy='single_host_origin'
              responseType='code'
              accessType='offline'
              scope='openid email profile https://www.googleapis.com/auth/calendar'
            />
          </div>

        ) : (

          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor='summary'>Summary</label>
                <br />
                <input type='text' id='summary' name='summary' value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div>
                <label htmlFor='description'>Description</label>
                <br />
                <input type='text' id='description' name='description' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label htmlFor='location'>Location</label>
                <br />
                <input type='text' id='location' name='location' value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div>
                <label htmlFor='startDateTime'>Start Date Time</label>
                <br />
                <input type='datetime-local' id='startDateTime' name='startDateTime' value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
              </div>

              <div>
                <label htmlFor='endDateTime'>End Date Time</label>
                <br />
                <input type='datetime-local' id='endDateTime' name='endDateTime' value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
              </div>
              <br />

              <button type='submit'>Create Event</button>
            </form>
          </div>
        )
      }
    </div>
  );
}

export default App;
