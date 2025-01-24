import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [count, setCount] = useState(0)
  const [reply, setReply] = useState("")
  const [inputText, setInputText] = useState("")
  function submitMessage(event) {
    event.preventDefault();
    console.log("submitMessage()");
    setReply(inputText);
    setInputText("");
    axios.get('/',{
      withCredentials: true,
      baseURL: "http://localhost:4001"
  }).then(response => {
      console.log(response)
      setReply(response.data);
    })
  }
  function inputChange(event) {
    console.log("inputChange()",event.target.value)
    event.preventDefault();
    setInputText(event.target.value)
  }
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
        <h3>{reply}</h3>
      </div>
    </>
  )
}

export default App
