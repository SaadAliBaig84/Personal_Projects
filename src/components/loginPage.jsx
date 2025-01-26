import React from "react";
import { act, useState } from "react";
import { User } from "lucide-react";
import { AtSign } from "lucide-react";
import { KeyRound } from "lucide-react";
import googleLogo from "../assets/icons8-google.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [activeTab, setActiveTab] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    // Perform your login logic here
    console.log("Logging in...");
    // Navigate to another page after the action
    navigate("/home"); // Navigate to the Profile page
  };
  const handleSubmit = async function () {
    try {
      let url, payload;
      if (activeTab === "Sign In") {
        url = "http://localhost:3000/auth/logIn";
        payload = { email, pass };
      } else {
        url = "http://localhost:3000/auth/signUp";
        payload = { name, email, pass };
      }

      const response = await axios.post(url, payload);
      console.log(`${activeTab} Response:`, response.data);
      alert(`${activeTab} Successful!`);
      console.log(response.data.jwt);
      localStorage.setItem("token", response.data.jwt);
      handleLogin();
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("Request made, no response received:", error.request);
      } else {
        console.error("Error in setup:", error.message);
      }
      alert(error.response.data.Error);
    }
  };
  return (
    // <div className='design'>
    //     <div className='card'>
    //         <div className='header'>
    //             <div className='text'>{activeTab}</div>
    //         </div>

    //         {activeTab === "Sign In" ? (
    //             <div className='Sign In'>
    //                 <div className='inputs'>
    //                     <div className='input'>
    //                         <AtSign />
    //                         <input type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
    //                     </div>
    //                     <div className='input'>
    //                         <KeyRound />
    //                         <input type="password" placeholder='Password' value={pass} onChange={(e)=>setPass(e.target.value)} required/>
    //                     </div>
    //                 </div>

    //                 <div className='password-recovery'>
    //                     <button className='Buttons dull-button'>Forgot password?</button>
    //                 </div>
    //             </div>
    //         ) : (
    //             activeTab === "Sign Up" && (
    //                 <div className='Sign Up'>
    //                     <div className='inputs'>
    //                         <div className='input'>
    //                             <User />
    //                             <input type="text" placeholder='Username' value={name} onChange={(e)=>setName(e.target.value)} required/>
    //                         </div>
    //                         <div className='input'>
    //                             <AtSign />
    //                             <input type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
    //                         </div>
    //                         <div className='input'>
    //                             <KeyRound />
    //                             <input type="password" placeholder='Password' value={pass} onChange={(e)=>setPass(e.target.value)} required />
    //                         </div>
    //                     </div>
    //                 </div>
    //             )
    //         )}

    //         <div>
    //             <button className='Buttons custom-button' onClick={handleSubmit}>{activeTab}</button>
    //             <button
    //                 className='Buttons dull-button'
    //                 onClick={() => setActiveTab(activeTab === "Sign In" ? "Sign Up" : "Sign In")}
    //             >
    //                 {activeTab === "Sign In" ? "Sign Up" : "Sign In"}
    //             </button>
    //         </div>

    //         <button className='Buttons googleLogin'>
    //             <img src={googleLogo} alt="Google Logo" />
    //             Continue with Google
    //         </button>
    //     </div>
    // </div>
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-indigo-500 [mask-image:radial-gradient(64rem_64rem_at_top,#1e3a8a,#1e293b,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M100 200V.5M.5 .5H200"
                fill="none"
                //className="animated-squares"
                //strokeWidth="2"
              />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-indigo-100">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z 
     M300.5 200h201v201h-201Z M0.5 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            //fill="url(#animated-pattern)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
      </div>
      <div className="card">
        <div className="header">
          <div className="text">{activeTab}</div>
        </div>

        {activeTab === "Sign In" ? (
          <div className="Sign In">
            <div className="inputs">
              <div className="input">
                <AtSign />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input">
                <KeyRound />
                <input
                  type="password"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="password-recovery">
              <button className="Buttons dull-button">Forgot password?</button>
            </div>
          </div>
        ) : (
          activeTab === "Sign Up" && (
            <div className="Sign Up">
              <div className="inputs">
                <div className="input">
                  <User />
                  <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <AtSign />
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <KeyRound />
                  <input
                    type="password"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )
        )}

        <div>
          <button className="Buttons custom-button" onClick={handleSubmit}>
            {activeTab}
          </button>
          <button
            className="Buttons dull-button"
            onClick={() =>
              setActiveTab(activeTab === "Sign In" ? "Sign Up" : "Sign In")
            }
          >
            {activeTab === "Sign In" ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <button className="Buttons googleLogin">
          <img src={googleLogo} alt="Google Logo" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
