import Script from 'next/script';
import { shell } from './shell';
export default function Home(){return <><div dangerouslySetInnerHTML={{__html:shell}}/><Script src="/app.js" strategy="afterInteractive"/><noscript>This site requires JavaScript for scoring and match navigation.</noscript></>}
