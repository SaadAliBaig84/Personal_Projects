import React from "react";
import { User } from "lucide-react";
import { AtSign } from "lucide-react";
import { KeyRound } from "lucide-react";
import googleLogo from "../assets/icons8-google.svg";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { login } from "./authSlice";
import { useDispatch } from "react-redux";
import { useCookies, Cookies } from "react-cookie";
function LoginPage() {
  const [activeTab, setActiveTab] = useState("Sign In");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookies] = useCookies(["jwt"]);

  const googleLogin = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data) => {
    try {
      clearErrors();
      let url, payload;
      if (activeTab === "Sign In") {
        url = "http://localhost:3000/auth/logIn";
        payload = { email: data.email, pass: data.password };
      } else {
        url = "http://localhost:3000/auth/signUp";
        payload = { name: data.name, email: data.email, pass: data.password };
      }

      const response = await axios.post(url, payload);
      console.log(`${activeTab} Response:`, response.data);
      console.log(`JWT: ${response.data.jwt}`);

      setCookies("jwt", response.data.jwt, {
        path: "/",
        secure: true,
        sameSite: "Strict",
        maxAge: 86400,
      });
      localStorage.setItem(
        "googleVerified",
        response.data.googleVerified.toString()
      );
      dispatch(login(response.data.jwt));
      console.log("Set local gv to " + response.data.googleVerified);
      navigate("/home");
      clearErrors();
    } catch (error) {
      console.error("Error:", error.response?.data);

      // Ensure the error is a string or plain object before rendering
      const backendErrors = error.response?.data?.errors || {};
      const generalError = error.response?.data?.Error;

      // Log backend response to inspect its structure
      console.log("Backend Error Structure:", error.response?.data);

      // Handling specific field errors from the backend
      Object.keys(backendErrors).forEach((field) => {
        setError(field, {
          type: "server",
          message: backendErrors[field], // Expecting string messages
        });
      });

      // If there's a general error, handle it correctly
      if (!Object.keys(backendErrors).length && generalError) {
        setError("general", {
          type: "server",
          message: generalError || "An unexpected error occurred",
        });
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }, // Trigger validation on submit
  });
  const currCookies = new Cookies();
  const jwt = currCookies.get("jwt");
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("jwt")) {
      localStorage.setItem(
        "googleVerified",
        queryParams.get("googleVerified").toString()
      );

      localStorage.setItem(
        "profilePicture",
        queryParams.get("profilePicture").toString()
      );
      console.log(localStorage.getItem("profilePicture"));
      console.log(queryParams.get("googleVerified").toString());
      setCookies("jwt", queryParams.get("jwt"), {
        path: "/",
        secure: true,
        sameSite: "Strict",
        maxAge: 86400,
      });
      console.log("Set local gv to " + queryParams.get("googleVerified"));
      dispatch(login(queryParams.get("jwt")));
      navigate("/home");
    } else if (jwt) {
      navigate("/home");
    } else {
      // Call reset when the component is mounted
      reset({
        name: "",
        email: "",
        password: "",
      });
      clearErrors();
      console.log("Not empty dep useEffect"); // Clears all form fields and errors
    }
  }, [location.search]);
  if (!jwt)
    return (
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
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {activeTab === "Sign In" ? (
              <div className="Sign In">
                <div className="inputs">
                  <div className="input">
                    <AtSign />
                    <div className="form-control">
                      <input
                        type="text"
                        placeholder="Email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                            message: "Email is not valid",
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="errorMsg">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="input">
                    <KeyRound />
                    <div className="form-control">
                      <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password should be at least 6 characters",
                          },
                        })}
                      />
                      {errors.password && (
                        <p className="errorMsg">{errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="password-recovery">
                  <button className="Buttons dull-button">
                    Forgot password?
                  </button>
                </div>
              </div>
            ) : (
              activeTab === "Sign Up" && (
                <div className="Sign Up">
                  <div className="inputs">
                    <div className="input">
                      <User />
                      <div className="form-control">
                        <input
                          type="text"
                          placeholder="Username"
                          {...register("name", {
                            required: "Username is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$|^[a-zA-Z0-9_.-]+$/,
                              message: "Username is not valid",
                            },
                            minLength: {
                              value: 2,
                              message: "Username must be at least 2 characters",
                            },
                            maxLength: {
                              value: 20,
                              message: "Username must be at most 20 characters",
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="errorMsg">{errors.name.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="input">
                      <AtSign />
                      <div className="form-control">
                        <input
                          type="text"
                          placeholder="Email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                              message: "Email is not valid",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="errorMsg">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="input">
                      <KeyRound />
                      <div className="form-control">
                        <input
                          type="password"
                          placeholder="Password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message:
                                "Password should be at least 6 characters",
                            },
                          })}
                        />
                        {errors.password && (
                          <p className="errorMsg">{errors.password.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div>
              <button
                onClick={() => clearErrors()}
                className="Buttons"
                type="submit"
                //onClick={handleSubmit(onSubmit)}
              >
                {activeTab}
              </button>
              <button
                className="Buttons"
                onClick={() =>
                  setActiveTab(activeTab === "Sign In" ? "Sign Up" : "Sign In")
                }
                type="button"
              >
                {activeTab === "Sign In" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </form>
          {errors.general && (
            <p className="errorMsg text-red">{errors.general.message}</p>
          )}

          <button className="Buttons googleLogin" onClick={googleLogin}>
            <img src={googleLogo} alt="Google Logo" />
            Continue with Google
          </button>
        </div>
      </div>
    );
}

export default LoginPage;
