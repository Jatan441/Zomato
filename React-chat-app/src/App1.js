import React, { useState, useRef } from 'react';
import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore';

 //initialize firebase in our code
 firebase.initializeApp({
  // I need to add my configuration for connecting to the database
  apiKey: "AIzaSyBkKrxQCi33TFjkpMlB2FZQieCQxUTvgfs",
  authDomain: "react-chat-app-9833e.firebaseapp.com",
  projectId: "react-chat-app-9833e",
  databaseURL:"https://react-chat-app-9833e.firebaseio.com",
  storageBucket: "react-chat-app-9833e.appspot.com",
  messagingSenderId: "986132546648",
  appId: "1:986132546648:web:2f6c5014acd680f3c2b62d",
  measurementId: "G-4200Y25CET"
 });


 const auth = firebase.auth();
 const firestore = firebase.firestore();
function App() {

  const [user] = useAuthState(auth);

  return (

    <>
    <div className='App'>
      <header>
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
    

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      </div>
      </>
 
  );
}

function SignOut(){
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}> SignOut</button>
  )
}


function SignIn() {

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return(
  <>
  <button className='sign-in' onClick={signInWithGoogle}> Signin with google </button>
  <p>Do not violate the community guidelines or you will be banned for life!</p>
  </>
  )
}

function ChatRoom(){
  // Display the messages
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);
  const [messages] = useCollectionData(query,{idfield:'id'});
  const [formValue, setFormValue] = useState('');
  console.log(query);
  const sendMessage = async(e)=>{
    const  {uid, photoURL} = auth.currentUser;
    e.preventDefault();
    await messagesRef.add({
      text : formValue,
      createAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
   
  }

  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key = {msg.id} message ={msg}/>)}  
      <span ref={dummy}></span>
    </main>


    <form onSubmit={sendMessage}>
      <input value={formValue} onChange = {(e) => setFormValue(e.target.value)}/>
      <button type='submit' disabled = {!formValue}>Send Message</button>
    </form>
    </>   
    )
    }

function ChatMessage(props){
  const {uid, text, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent ' :'received';
  
  return(
    <>
    <div className = {`message ${messageClass}`}>
    <img src = {photoURL || "https://www.shutterstock.com/search/male-avatar"}/>
    </div>
    <p>{text}</p>
    </> 
  )
}



export default App;
