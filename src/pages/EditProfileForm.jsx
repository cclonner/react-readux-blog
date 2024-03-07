/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { edit } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "../service/config";
import axios from "axios";

const FormContainer = styled.div`
  position: relative;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(217, 217, 217);
  box-shadow: rgba(0, 0, 0, 0.07) 0px 22px 106px, rgba(0, 0, 0, 0.05) 0px 9.19107px 44.2843px,
    rgba(0, 0, 0, 0.043) 0px 4.91399px 23.6765px, rgba(0, 0, 0, 0.035) 0px 2.75474px 13.2728px,
    rgba(0, 0, 0, 0.027) 0px 1.46302px 7.04911px, rgba(0, 0, 0, 0.02) 0px 0.608796px 2.93329px;
  border-radius: 6px;
  width: 384px;
  margin: 10px auto 0;
  box-sizing: border-box;
  padding: 36px 32px 46px;
  min-height: 374px;
`;

const Form = styled.form``;

const FormTitle = styled.h3`
  margin: 0px 0px 21px;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: rgba(0, 0, 0, 0.75);
`;

const Input = styled.input`
  font-family: inherit;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.75);
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
`;

const SubmitButton = styled.input.attrs({ type: "submit" })`
  width: 100%;
  box-sizing: border-box;
  background: rgb(24, 144, 255);
  border-radius: 4px;
  padding: 8px 12px;
  border: 1px solid rgb(24, 144, 255);
  color: rgb(255, 255, 255);
  cursor: pointer;
  margin-top: 10px;
  &:disabled {
    background: rgba(24, 144, 255, 0.5);
    border-color: rgba(24, 144, 255, 0.5);
    // cursor: not-allowed;
  }
`;

const IncorrectData = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgb(245, 34, 45);
`;

const LabelContainer = styled.div`
  margin-bottom: 12px;
`;

const TitleInput = styled.span`
  margin-left: 10px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.75);
`;

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
      // eslint-disable-next-line no-shadow
      .catch((error) => {
        setError(error.response.data.errors);
      });
  };
  // запрос для отображения старых данных пользователя при переходе на редактирование.
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
    // проверяем корректность email и устанавливаем соответствующее значение ошибки
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Email data is incorrect");
    } else {
      setError("");
    }
  }, [email]);

  return (
    <FormContainer>
      <FormTitle>Edit Profile</FormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <LabelContainer>
          <label htmlFor="username">
            <TitleInput>Username</TitleInput>
            <Input
              value={usernameInput}
              type="text"
              name="username"
              {...register("username", {
                required: "The field is required ",
              })}
              onChange={(event) => setUsernameInput(event.target.value)}
            />
            {error?.username && <IncorrectData>{error?.username}</IncorrectData>}
          </label>
        </LabelContainer>
        <LabelContainer>
          <label htmlFor="email">
            <TitleInput>Email address</TitleInput>
            <Input
              value={emailInput}
              type="email"
              name="email"
              {...register("email")}
              onChange={(event) => setEmailInput(event.target.value)}
            />
            {error?.email && <IncorrectData>{error?.email}</IncorrectData>}
          </label>
        </LabelContainer>
        <LabelContainer>
          <label htmlFor="password">
            <TitleInput>Password</TitleInput>
            <Input
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
            />
            {errors?.password && <IncorrectData>{errors?.password?.message}</IncorrectData>}
          </label>
        </LabelContainer>
        <LabelContainer>
          <label htmlFor="imageUrl">
            <TitleInput>Avatar image (url)</TitleInput>
            {/* <Input type="text" name="imageUrl" {...register("imageUrl")} /> */}
            <Input
              type="text"
              name="imageUrl"
              {...register("imageUrl", {
                required: "The field is required ",
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: "Enter a valid image link",
                },
              })}
            />
            {errors.imageUrl && <IncorrectData>{errors.imageUrl.message}</IncorrectData>}
          </label>
        </LabelContainer>
        <SubmitButton value="Confirm edit profile" disabled={!isValid} />
      </Form>
    </FormContainer>
  );
}

export default EditProfileForm;
