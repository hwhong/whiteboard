import React from "react";
import styles from "./toolbar.module.css";

export function Toolbar() {
  return (
    <div className={styles.root}>
      <div className={styles.leftContent}>
        <div className={styles.block}></div>
      </div>
      <div className={styles.centerContent}></div>
      <div className={styles.rightContent}></div>
    </div>
  );
}
