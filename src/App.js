import React, { useEffect, useState } from "react";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CloseIcon from '@material-ui/icons/Close';
import axios from './axios'
import Pusher from 'pusher-js'
import './App.css';


function App() {
  const [input, setInput] = useState("");

  const [user, setUser] = useState("User");

  const [selected, setSelected] = React.useState(false);

  const [selectedLauncher, setSelectedLauncher] = React.useState(false);


  const [messages, setMessages] = useState([])

  useEffect(() => {
    const pusher = new Pusher('ee7f716a237417152a4f', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages])

  useEffect(() => {
    axios.delete("messages/del").then((response) => {
      axios.post("messages/new", {
        message: "Hi, how can I help you today",
        name: "Staff",
        timestamp: new Date().toUTCString(),
        received: false,
      });
    });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (user === "User") {
      await axios.post("messages/new", {
        message: input,
        name: "User",
        timestamp: new Date().toUTCString(),
        received: true,
      });
    } else {
      await axios.post("messages/new", {
        message: input,
        name: "Staff",
        timestamp: new Date().toUTCString(),
        received: false,
      });
    }

    setInput("");
  };

  return (

    <div className="App">
          <div className="main">
{selectedLauncher && 
    <div className="chat">
      <div className="chat__header">
        <ToggleButton
          className="toggleButton"
          value="check"
          selected={selected}
          onChange={() => {
            setSelected(!selected);
            if (selected) {
              setUser("User");
            } else {
              setUser("Staff");
            }
          }}
        >
          <h4>{user}</h4>
        </ToggleButton>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${message.received && "chat__reciever"}`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
}
        <ToggleButton className="toggleLauncher"
                  selected={selectedLauncher}
        onChange={() => {
          setSelectedLauncher(!selectedLauncher);

        }}
        >
          {selectedLauncher ? <CloseIcon/> : <ChatBubbleIcon/>}        
</ToggleButton>
</div>

</div>
  );
}

export default App;
