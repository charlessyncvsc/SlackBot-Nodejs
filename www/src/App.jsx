import { useState,useEffect } from 'react'
import './App.css'
import axios from "axios"

function App() {
  const [dialog, setDialog] = useState([]);
  const [dialog1, setDialog1] = useState([]);
  const [inputText, setInputText] = useState("");
  const [artist, setArtist] = useState("");
  const [dateTime,setDateTime] = useState("");

  const [messages, setMessages] = useState([]);


  function submitMessage(event) {
    event.preventDefault();
    console.log("submitMessage()");
    let message = {user: "test", message: inputText}
    // setDialog([...dialog,message])
    console.log("########## dialog", dialog)
    setInputText("");
    axios.get('/',{
      withCredentials: true,
      baseURL: "http://localhost:4001"
  }).then(response => {
      console.log(response)
      let reply = {user: "bot", message: response.data}
      setDialog([...dialog, message,reply]);
    }).catch(err => {
      let reply = {user: "system", message: "error"}
      setDialog([...dialog, message, reply]);
      console.log(err);
    })
  }

  // submit via the webpage the booking information to the api
  // to demonstrate that the same api can be shared across the
  // web and chat frontends.
  function submitBooking(event) {
    event.preventDefault();
    let message = {user: "test", message: "submitting booking"}
    console.log("########## dialog", dialog)
    const booking = {user: "test", booking: {person: artist, date_time: dateTime} }

    axios.post('/booking/new',{data:booking},{
      withCredentials: true,
      baseURL: "http://localhost:4001"
    }).then(response => {
          let reply = {user: "bot", message: response.data.message}
          setDialog1([...dialog1, message,reply]);
    }).catch(err => {
          let reply = {user: "system", message: "error"}
          console.log(err);
    })
  }

  // utility functions for booking fields
  function inputChange(event) {
    console.log("inputChange()",event.target.value)
    event.preventDefault();
    setInputText(event.target.value)
  }

  function inputArtist(event) {
    console.log("inputArtist()",event.target.value)
    event.preventDefault();
    setArtist(event.target.value)
  }


  function inputDateTime(event) {
    console.log("inputDateTime()",event.target.value)
    event.preventDefault();
    setDateTime(event.target.value)
  }


  return (
    <>
      <h1>Play site</h1>
      <div className='row'>
        <div className='column'>
          <h5>Chat</h5>
          <form onSubmit={submitMessage}>
            <label>Type something: </label>
            <input type="text" value={inputText} onChange={event => {inputChange(event)}}></input>
            <button type="submit">send</button>
          </form>
          <ul>
          {dialog && dialog.length>0 && dialog.slice(0).reverse().map(m => (
            <li className={m.user=="bot"? "botMessage": "userMessage"} style={{listStyleType: "none"}} key={m.id}>
              {m.user}: {m.message}
            </li>))}
          </ul>
        </div>
        <div className='column'>
          <h5>Booking</h5>
          <form onSubmit={submitBooking}>
            <div className='row'>
              <label for="artist">Artist: </label>
              <input type="text" value={artist} onChange={event => {inputArtist(event)}} id="artist"></input>
            </div>
            <div className="row">
              <label for="datetime">Date/time: </label>
              <input type="datetime-local" value={dateTime} onChange={event => {inputDateTime(event)}} id="datetime"></input>
            </div>
            <button type="submit">send</button>
          </form>
          <ul>
          {dialog1 && dialog1.length>0 && dialog1.slice(0).reverse().map(m => (
            <li className={m.user=="bot"? "botMessage": "userMessage"} style={{listStyleType: "none"}} key={m.id}>
              {m.user}: {m.message}
            </li>))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
