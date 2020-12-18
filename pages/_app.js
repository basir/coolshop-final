import React, { useEffect } from 'react';
import '../styles/style.css';
import '../styles/form.css';
import { StoreProvider } from '../components/Store';
import { absoluteUrl, getAppCookies, verifyToken } from '../utils/auth';

export default function MyApp({ pageProps, Component }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      console.log('remove');
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const request = appContext?.ctx?.req;
  if (!request) return {};
  const { origin } = absoluteUrl(request);

  const baseApiUrl = `${origin}/api`;

  const { token } = getAppCookies(request);
  const userInfo = token
    ? { ...verifyToken(token.split(' ')[1]), token: token.split(' ')[1] }
    : '';
  return {
    pageProps: {
      baseApiUrl,
      userInfo,
    },
  };
};
