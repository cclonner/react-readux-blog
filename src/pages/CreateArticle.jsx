/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory, Redirect } from "react-router-dom";
import { selectIsAuth } from "../store/authSlice";
import { fetchCreateArticle } from "../store/articlesSlice";
import styles from "./CreateArticle.module.scss";

function CreateArticle() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      tags: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    rules: {
      required: "Please append at least 1 item",
    },
  });

  const onSubmit = (data) => {
    const userData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.textarea,
        tagList: data.tags.map((el) => el.name),
      },
    };
    dispatch(fetchCreateArticle(userData)).then((res) => {
      localStorage.setItem("slug", res.payload.slug);
      history.push(`/articles/${res.payload.slug}`);
      localStorage.removeItem("slug");
    });
  };

  if (!isAuth && !localStorage.getItem("token")) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create new article</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Title</span>
            <input
              type="text"
              name="title"
              className={styles.input}
              {...register("title", {
                required: "The field is required",
              })}
            />
            {errors?.title && <div className={styles.incorrectData}>{errors?.title?.message}</div>}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Short description</span>
            <input
              type="text"
              name="description"
              className={styles.input}
              {...register("description", {
                required: "The field is required ",
              })}
            />
            {errors?.description && (
              <div className={styles.incorrectData}>{errors?.description?.message}</div>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="textarea">
            <span className={styles.titleInput}>Description</span>
            <textarea
              type="text"
              name="textarea"
              className={styles.textInput}
              {...register("textarea", {
                required: "The field is required ",
              })}
            />
            {errors?.textarea && (
              <div className={styles.incorrectData}>{errors?.textarea?.message}</div>
            )}
          </label>
        </div>
        <div>
          <span className={styles.titleTag}>Tags</span>
        </div>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <section key={field.id}>
              <label htmlFor={`tags.${index}.name`}>
                <input
                  type="text"
                  name={`tags.${index}.name`}
                  className={styles.tagInput}
                  {...register(`tags.${index}.name`, {
                    required: "The field is required ",
                  })}
                />
              </label>
              <button
                type="button"
                className={styles.buttonDeleteTag}
                onClick={() => {
                  remove(index);
                }}
              >
                Delete Tag
              </button>
              {index === fields.length - 1 && (
                <button
                  type="button"
                  className={styles.buttonAddTag}
                  onClick={() => {
                    append({
                      name: "",
                    });
                  }}
                >
                  Add Tag
                </button>
              )}
              {index === fields.length - 1 && field.name === "" && (
                <div className={styles.warningData}>
                  Перед отправкой формы, убедитесь что поле не пустое.
                </div>
              )}
            </section>
          ))
        ) : (
          <button
            type="button"
            className={styles.buttonAddTag}
            onClick={() => {
              append({
                name: "",
              });
            }}
          >
            Add Tag
          </button>
        )}
        <input type="submit" className={styles.submitButton} value="Create" disabled={!isValid} />
      </form>
    </div>
  );
}

export default CreateArticle;
