import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  interface projectInfo {
    name: string | undefined,
    liveSiteUrl: string | undefined,
    sourceCodeUrl: string | undefined,
    summary: string | undefined;
    retrospective: string | undefined;
    previewImgUrl: string | undefined;
  };
  
  const projectsFEM: projectInfo[] = [
    {
      name: 'REST Countries API with color theme switcher',
      liveSiteUrl: '/rest-countries-api',
      sourceCodeUrl: 'https://github.com/einedev/frontend-practice/tree/main/src/app/rest-countries-api',
      summary: undefined,
      retrospective: undefined,
      previewImgUrl: undefined,
    },
    {
      name: 'ip-address-tracker',
      liveSiteUrl: '/ip-address-tracker',
      sourceCodeUrl: undefined,
      summary: undefined,
      retrospective: undefined,
      previewImgUrl: undefined,
    }
  ];

  return (
    <div className={styles.main}>
      <h1>Welcome!</h1>
      <p>(wip...)</p>
      <h2>Frontend Mentor Projects</h2>
      <Link href="https://www.frontendmentor.io/profile/einedev">My profile on Frontend Mentor</Link>
      <hr />
      <ul>
        {projectsFEM.map((proj, index) => (
          <li>{proj.name}
            <ul>
            {proj.liveSiteUrl ? <li><Link href={proj.liveSiteUrl}>Live site</Link></li> : <></>}
            {proj.sourceCodeUrl ? <li><Link href={proj.sourceCodeUrl}>Source code</Link></li> : <></>}
            </ul>
          </li>
        ))}
      </ul>
      <h2>Others</h2>
      <p>(wip...)</p>
    </div>
  );
}
