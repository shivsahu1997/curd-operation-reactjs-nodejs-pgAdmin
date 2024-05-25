import React from "react";
import { GoogleLogin } from "react-google-login";
import { useForm } from "react-hook-form";

const UserSignin = () => {
  let REACT_APP_SOCIAL_GOOGLE_KEY =
    "501814363872-5aiua43d4t90rd8funbv0tm74hpr5uue.apps.googleusercontent.com";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const _onSubmitData = (val) => {
    console.log("val", val);
  };

  const _socialLogin = (response) => {
    console.log("res", response);
  };

  return (
    <div className='signin_container mt-5'>
      <div className='text-center'>
        <h2>Sign In</h2>
      </div>
      <form className='content mt-5' onSubmit={handleSubmit(_onSubmitData)}>
        <div className='form-group'>
          <label>
            Email/Username
            <span className='mandatoryField'>*</span>
          </label>
          <input
            type='text'
            id={"username"}
            className={`form-control mt-2 ${
              errors.username ? "is-invalid" : ""
            }`}
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])[a-zA-Z\- ]+$/,
                message: "Username can only contain letters",
              },

              maxLength: {
                value: 25,
                message: "Maximum 25 characters",
              },
            })}
          />
          <div className='invalid-feedback'>{errors?.username?.message}</div>
        </div>

        <div className='form-group mt-4'>
          <label>
            Password
            <span className='mandatoryField'>*</span>
          </label>
          <input
            type='text'
            id={"password"}
            className={`form-control mt-2  ${
              errors.password ? "is-invalid" : ""
            }`}
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])[a-zA-Z\- ]+$/,
                message: "Password can only contain letters",
              },
              maxLength: {
                value: 25,
                message: "Maximum 25 characters",
              },
            })}
          />
          <div className='invalid-feedback'>{errors?.password?.message}</div>
        </div>
        <div className='text-center mt-4'>
          <button type='submit' className='btn btn-primary'>
            Sign In
          </button>
        </div>
        <div className='text-center mt-4'>
          <span className='bg-white'>----- or -----</span>
        </div>

        <div className='text-center mt-4'>
          <GoogleLogin
            clientId={REACT_APP_SOCIAL_GOOGLE_KEY}
            className={`w-100 text-center justify-content-center`}
            buttonText='Sign in with Google'
            onSuccess={_socialLogin}
            onFailure={_socialLogin}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </form>
    </div>
  );
};
export default UserSignin;
