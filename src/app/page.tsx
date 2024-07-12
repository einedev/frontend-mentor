import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Frontend Mentor Projects</h1>
      <ul>
        <li><Link href="/rest-countries-api">REST Countries API with color theme switcher</Link></li>
      </ul>
    </main>
  );
}
