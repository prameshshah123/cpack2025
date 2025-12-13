// pages/_app.js - SIMPLIFIED VERSION
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
    </>
  );
}

export default MyApp;
