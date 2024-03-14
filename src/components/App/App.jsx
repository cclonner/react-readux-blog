import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Main from "../Main/Main";
import { Switch, Route, Redirect, useParams } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Details from "../../pages/Details";
import LoginForm from "../../pages/LoginForm";
import RegistrationForm from "../../pages/RegistrationForm";
import EditProfileForm from "../../pages/EditProfileForm";
import CreateArticle from "../../pages/CreateArticle";
import EditArticle from "../../pages/EditArticle";
import { useSelector } from "react-redux";
import { selectAuthData, selectAuthStatus } from "../../store/authSlice";
import { Alert } from "antd";
import { getArticle } from "../../service/config";
import axios from "axios";

function App() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const currentUser = useSelector(selectAuthData);
  const isAuthor = () => currentUser?.username === article?.author?.username;
  const status = useSelector(selectAuthStatus);
  const error = status === "rejected" && (
    <Alert message="Произошла ошибка. Мы уже работаем над этим." type="error" showIcon />
  );

  useEffect(() => {
    if (slug) {
      axios.get(getArticle(slug)).then(({ data }) => {
        setArticle(data.article);
      });
    }
  }, [slug]);
  return (
    <>
      <Header />
      <Main>
        {error}
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage />
          </Route>
          <Route path="/articles/:slug/edit">
            {isAuthor() ? <EditArticle /> : <Redirect to="/" />}
          </Route>
          <Route path="/articles/:slug" component={Details} />
          <Route path="/:new-article" component={CreateArticle} />
          <Route path="/:sign-in" component={LoginForm} />
          <Route path="/:sign-up" component={RegistrationForm} />
          <Route path="/:profile" component={EditProfileForm} />
        </Switch>
      </Main>
    </>
  );
}

export default App;
