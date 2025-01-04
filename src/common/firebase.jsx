// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDZHWqaVPp2XNH47rL1bfZOLGF3l1306Iw",
  authDomain: "react-js-blog-website-4e7ee.firebaseapp.com",
  projectId: "react-js-blog-website-4e7ee",
  storageBucket: "react-js-blog-website-4e7ee.appspot.com",
  messagingSenderId: "812069305005",
  appId: "1:812069305005:web:c3bd7559b7921c6bda6424"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () =>{
    let user = null ;
    await signInWithPopup(auth, provider)
      .then((res)=>{
         user = res.user;
      })
      .catch((err)=>{
        console.log(err);
      })

    return user;
}