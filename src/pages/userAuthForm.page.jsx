import React, { useContext, useRef, useEffect } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from 'react-hot-toast';
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef(null);
  let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.error || "An error occurred");
      });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get form element directly from the event
    const form = e.target;
    
    if (!form) {
      return toast.error("Form submission failed");
    }

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let formData = {};

    // Use FormData API more safely
    const formDataObj = new FormData(form);
    formDataObj.forEach((value, key) => {
      formData[key] = value;
    });

    const { fullname, email, password } = formData;

    // Validation checks
    if (type !== "sign-in" && (!fullname || fullname.length < 3)) {
      return toast.error("Full name must be at least 3 letters long");
    }

    if (!email) {
      return toast.error("Email is required");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!password) {
      return toast.error("Password is required");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      const serverRoute = "/google-auth";
      const formData = {
        access_token: user.accessToken
      };
      userAuthThroughServer(serverRoute, formData);
    } catch (error) {
      console.error("Error in Google Auth:", error);
      toast.error("Google authentication failed");
    }
  }

  if (access_token) {
    return <Navigate to="/" />;
  }

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Back" : "Join us today"}
          </h1>
          
          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}
          
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
            required
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
            required
          />

          <button className="btn-dark center mt-14" type="submit">
            {type.replace("-", " ")}
          </button>

          <div className="w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button 
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center" 
            onClick={handleGoogleAuth}
            type="button"
          >
            <img className="w-5" src={googleIcon} alt="Google icon" />
            continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?{" "}
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
