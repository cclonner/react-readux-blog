import { useSelector } from "react-redux";
import styles from "./Main.module.scss";

function Main({ children }) {
  const status = useSelector((state) => state.articles.status);
  const articles = useSelector((state) => state.articles.articles);
  const loading = articles.length === 0 && status === "loading" && (
    <div className={styles.Spinner} />
  );
  return (
    <main className={styles.Wrapper}>
      <div className={styles.Container}>{children}</div>
      {loading}
    </main>
  );
}

export default Main;
