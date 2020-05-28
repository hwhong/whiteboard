import React from "react";
import styles from "./toolbar.module.css";

export function Toolbar() {
  return (
    <div className={styles.root}>
      <div className={styles.left}></div>
      <div className={styles.center}></div>
      <div className={styles.right}></div>
    </div>
  );
}
