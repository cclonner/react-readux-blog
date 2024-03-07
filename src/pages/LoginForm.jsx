/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../store/authSlice";
import { Redirect } from "react-router-dom";
import styles from "./RegistrationForm.module.scss";

function LoginForm() {
  const [error, setError] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onBlur",
  });

  const email = watch("email");

  const onSubmit = (data) => {
    const userData = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    dispatch(fetchAuth(userData)).then((result) => {
      if (!result.payload) {
        setErrorPass("Incorrect password");
      }
    });
  };

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Email data is incorrect");
    } else {
      setError("");
    }
  }, [email]);

  if (isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Sign In</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input type="email" name="email" className={styles.input} {...register("email")} />
            {error && <span className={styles.incorrectData}>{error}</span>}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="password">
            <span className={styles.titleInput}>Password</span>
            <input
              type="password"
              name="password"
              className={styles.input}
              {...register("password", {
                required: true,
              })}
            />
            {errorPass && <span className={styles.incorrectData}>{errorPass}</span>}
          </label>
        </div>

        <input type="submit" className={styles.submitButton} value="Log in" disabled={!isValid} />
      </form>
    </div>
  );
}

export default LoginForm;
