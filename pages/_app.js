import React, { useEffect } from 'react';

import { StoreProvider } from '../components/Store';

export default function MyApp({ pageProps, Component }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

// MyApp.getInitialProps = async (appContext) => {
//   const request = appContext?.ctx?.req;
//   // not render on client
//   if (!request) return {};
//   return {
//     pageProps: {
//       userInfo,
//     },
//   };
// };
