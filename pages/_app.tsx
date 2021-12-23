import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'theme-ui';
import { defaultTheme } from '../themes/defaultTheme';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import { MainnetNetworkId, RinkebyNetworkId } from 'utilities/NetworkIds';
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
  );
}
export default MyApp;
