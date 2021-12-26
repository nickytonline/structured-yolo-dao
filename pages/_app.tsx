import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'theme-ui';
import { defaultTheme } from '../themes/defaultTheme';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import Head from 'next/head';
import { RinkebyNetworkId } from 'utilities/NetworkIds';
import 'regenerator-runtime/runtime'; // The ThirdWeb useWeb3 hook seems to require this.

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [RinkebyNetworkId];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to Structured YOLO DAO</title>
        <meta name="description" content="Welcome to Structured YOLO DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <ThirdwebWeb3Provider
          connectors={connectors}
          supportedChainIds={supportedChainIds}
        >
          <div sx={{ display: 'grid', placeItems: 'center' }}>
            <Component {...pageProps} />{' '}
          </div>
        </ThirdwebWeb3Provider>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
