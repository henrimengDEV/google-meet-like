import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Room.css";
declare let apiRTC: any;

function Room() {
  let userAgent: any;
  let connectedSession: any;
  let connectedConversation: any;
  const [message, setMessage] = useState("");

  useEffect(() => {
    userAgent = new apiRTC.UserAgent({
      uri: "apzkey:5867f7abf85af610b377409c10a107b4",
    });

    // Register UserAgent to create an apiRTC session
    userAgent
      .register({
        id: Math.random(),
      })
      .then(function (session: any) {
        console.log("Registration OK");
        connectedSession = session;
        connectedConversation = session.getConversation("conversation_1");
        configureConversation();
      })
      .catch(function (error: any) {
        console.log("Registration error", error);
      });
  }, []);

  const joinConversation = () => {
    connectedConversation
      .join()
      .then(function (response: any) {
        console.log(`Conversation [${connectedConversation.sessionId}] joined`);
      })
      .catch(function (err: any) {
        console.error("Conversation join error", err);
      });
  };

  //Wrapper to send a message to everyone in the conversation and display sent message in UI
  const sendMessageToConversion = (message: string) => {
    connectedConversation.sendMessage(message);
    handleMessageSent(connectedSession.user.username, message);
  };

  const handleMessageSent = (name: string, text: string) => {
    let message = document.createElement("p");
    message.innerHTML = `${name} : ${text}`;
    document.getElementById("chat").appendChild(message);
  };

  const configureConversation = () => {
    connectedConversation
      .on("message", function (message: any) {
        handleMessageSent(message.sender.userData.username, message.content);
      })
      .on("contactJoined", function (contact: any) {
        console.log("Contact that has joined :", contact);
      })
      .on("contactLeft", function (contact: any) {
        console.log("Contact that has left :", contact);
      });

    joinConversation();
  };

  useEffect(() => {
    console.log(message);
  }, [message]);

  return (
    <div>
      <p>Room Page</p>
      <input type="text" onChange={(event) => setMessage(event.target.value)} />
      <button onClick={() => sendMessageToConversion(message)}>
        Send message
      </button>
      <div id="conference">
        <div id="remote-container"></div>
        <div id="local-container"></div>
        <div id="chat"></div>
      </div>
    </div>
  );
}

export default Room;
