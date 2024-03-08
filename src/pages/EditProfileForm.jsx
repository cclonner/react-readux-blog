/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { edit } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "../service/config";
import axios from "axios";
import styles from "./EditProfileForm.module.scss";

function EditProfileForm() {
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const email = watch("email");

  const onSubmit = (data) => {
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.imageUrl,
      },
    };
    const token = localStorage.getItem("token");

    axios
      .put(`${BASE_URL}user`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        dispatch(edit(response.data));
        history.push("/");
      })
      .catch(() => {
        setError(error.response.data.errors);
      });
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}user`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUsernameInput(response.data.user.username);
      setEmailInput(response.data.user.email);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Email data is incorrect");
    } else {
      setError("");
    }
  }, [email]);

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Username</span>
            <input
              value={usernameInput}
              type="text"
              name="username"
              {...register("username", {
                required: "The field is required ",
              })}
              onChange={(event) => setUsernameInput(event.target.value)}
              className={styles.input}
            />
            {error?.username && <span className={styles.incorrectData}>{error?.username}</span>}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input
              value={emailInput}
              type="email"
              name="email"
              {...register("email")}
              onChange={(event) => setEmailInput(event.target.value)}
              className={styles.input}
            />
            {error?.email && <span className={styles.incorrectData}>{error?.email}</span>}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="password">
            <span className={styles.titleInput}>Password</span>
            <input
              type="password"
              name="password"
              {...register("password", {
                required: "The field is required ",
                minLength: {
                  value: 6,
                  message: "Too short password",
                },
                maxLength: {
                  value: 40,
                  message: "Too long password",
                },
              })}
              className={styles.input}
            />
            {errors?.password && (
              <span className={styles.incorrectData}>{errors?.password?.message}</span>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="imageUrl">
            <span className={styles.titleInput}>Avatar image (url)</span>
            <input
              type="text"
              name="imageUrl"
              {...register("imageUrl", {
                required: "The field is required ",
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: "Enter a valid image link",
                },
              })}
              className={styles.input}
            />
            {errors.imageUrl && (
              <span className={styles.incorrectData}>{errors.imageUrl.message}</span>
            )}
          </label>
        </div>
        <input
          type="submit"
          value="Confirm edit profile"
          disabled={!isValid}
          className={styles.submitButton}
        />
      </form>
    </div>
  );
}

export default EditProfileForm;
