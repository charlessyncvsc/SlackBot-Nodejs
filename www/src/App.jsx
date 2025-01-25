import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [dialog, setDialog] = useState([]);
  const [inputText, setInputText] = useState("");
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
  function inputChange(event) {
    console.log("inputChange()",event.target.value)
    event.preventDefault();
    setInputText(event.target.value)
  }

  useEffect(() => {
    console.log("Debug", dialog);
  },[dialog])
  return (
    <>
      <div>
      <h1>Play site</h1>
        <form onSubmit={submitMessage}>
          <label>Type something: </label>
          <input type="text" value={inputText} onChange={event => {inputChange(event)}}></input>
          <button type="submit">send</button>
        </form>
      </div>
      <div>
        <ul>
        {dialog && dialog.length>0 && dialog.slice(0).reverse().map(m => (<li style={{listStyleType: "none"}} key={m.id}>{m.user}: {m.message}</li>))}
        </ul>
      </div>
    </>
  )
}

export default App
