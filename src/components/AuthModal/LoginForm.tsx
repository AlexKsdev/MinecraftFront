import styles from "./AuthForm.module.scss";

export function LoginForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        // Stub: no backend wired up yet.
      }}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          Email
        </label>
        <input className={styles.input} id="login-email" type="email" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Password
        </label>
        <input
          className={styles.input}
          id="login-password"
          type="password"
          required
        />
      </div>
      <button className={styles.submit} type="submit">
        Log in
      </button>
    </form>
  );
}
