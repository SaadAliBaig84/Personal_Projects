import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Form from 'react-bootstrap/Form'
import {User} from 'lucide-react'
import {AtSign} from 'lucide-react'
import {KeyRound} from 'lucide-react'
import googleLogo from './assets/icons8-google.svg'

function App() {

  const [activeTab, setActiveTab] = useState("Sign In")
  let activeButton="Sign In";
  let notActiveButton="Sign Up";
  return (
    <>
    
      <div className='design'>
        <div className='card'>
          
          <div className='header'>
            <div className='text'>{activeTab}</div>
            
          </div>
          {
            activeTab==="Sign In" ? ( <div className='Sign In'>

                <div className='inputs'>
                  
                  <div className='input'>
                    <AtSign/>
                    <input type="text" placeholder='Email'/>
                  </div>

                  <div className='input'>
                    <KeyRound/>
                    <input type="text" placeholder='Password'/>
                  </div>


                </div>

              <div className='password-recovery'> 
                <button className='Buttons dull-button'>Forgot password?</button>
                
              </div>
              
            </div>):
            activeTab==="Sign Up"&&(
              <div className='Sign Up'>
                <div className='inputs'>
                  <div className='input'>
                    <User/>
                    <input type="text" placeholder='Username'/>
                  </div>

                  <div className='input'>
                    <AtSign/>
                    <input type="text" placeholder='Email'/>
                  </div>

                  <div className='input'>
                    <KeyRound/>
                    <input type="text" placeholder='Password'/>
                  </div>


                </div>

            
              </div>

            )
          }
         

          
          <div>
              
              <button className='Buttons custom-button'>{activeTab}</button>
              <button className='Buttons dull-button' onClick={()=>{activeTab==="Sign In"? setActiveTab("Sign Up") : setActiveTab("Sign In")}}>{activeTab === "Sign In" ? "Sign Up" : "Sign In"}</button>
              
          </div>

         
          <button className='Buttons googleLogin'>
              <img src={googleLogo} alt="Google Logo" />
              Continue with google
          </button>
            
          
          
        </div>  
      </div>              
    </>
  )
}

export default App
