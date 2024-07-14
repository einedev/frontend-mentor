import { useTheme } from "next-themes";
import { FaMoon, FaRegMoon } from "react-icons/fa";
import styles from '../styles/styles.module.scss';

export default function ThemeToggle() {

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
    className={`${styles.themeButton}`}
    onClick={toggleTheme}
    suppressHydrationWarning
    >
      {theme === 'light' ? <FaRegMoon /> : <FaMoon />}
      <span>Dark Mode</span>
    </button>
  );
};