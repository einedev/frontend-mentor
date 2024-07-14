import { useTheme } from "next-themes";
import ThemeToggle from "./themeToggle";

import styles from '../styles/styles.module.scss';

export default function NavBar() {
  const { theme } = useTheme();
  return (
    <div className={`${styles.navBar}`}>
      <p className={`${styles.navTitle}`}>Where in the world?</p>
      <ThemeToggle/>
    </div>
  )
};