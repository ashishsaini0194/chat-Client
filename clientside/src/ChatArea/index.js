import { io } from "socket.io-client";
import "./index.css";
import react, { useEffect, useState } from "react";

export default function ChatArea(props) {
  const form = document.querySelector("form");
  const input = document.querySelector(".input");
  // const messages = document.querySelector(".messages");
  let username;

  const [messages, setMessages] = useState([]);
  const room = 1;

  useEffect(() => {
    console.log("ran");
    if (window.socket) return;
    username = prompt("Please enter a nickname: ", "");
    const socket = io("http://localhost:3001", {
      reconnectionAttempts: 0,
      reconnection: false,
    });

    socket.on("connect", () => {
      console.log(socket.id);
      // addMessage("You have joined the chat as '" + username + "'.");
      // socket.emit("user_join", username);
      socket.emit("joinRoom", { username, room });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      window.socket = socket;
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function submit(event) {
    console.log("clicked", input?.value);
    event.preventDefault();

    // addMessage({ user: username, text: input.value });

    window.socket.emit("chatMessage", {
      message: input.value,
    });
  }

  function addMessage(mssg) {
    setMessages([...messages, mssg]);
  }
  console.log({ messages });
  return (
    <>
      <ul className="messages">
        {messages.map((each, index) => (
          <li key={index}>
            {each.user}: {each.text}
          </li>
        ))}
      </ul>
      <form onSubmit={submit}>
        <input type="text" className="input" />
        <button>Send</button>
      </form>
    </>
  );
}
