import styles from "./AuthForm.module.scss";

export function RegisterForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        // Stub: no backend wired up yet.
      }}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-name">
          Name
        </label>
        <input className={styles.input} id="register-name" type="text" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-email">
          Email
        </label>
        <input
          className={styles.input}
          id="register-email"
          type="email"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-password">
          Password
        </label>
        <input
          className={styles.input}
          id="register-password"
          type="password"
          required
        />
      </div>
      <button className={styles.submit} type="submit">
        Create account
      </button>
    </form>
  );
}
