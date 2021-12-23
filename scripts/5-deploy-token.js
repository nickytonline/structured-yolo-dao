import sdk from './1-initialize-sdk.js';

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule('0x0F6a2bD658D57F79B480066e31742A152dc01B94');

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: 'StructuredYOLODAO Governance Token',
      // What's your token's symbol? Ex. "ETH"
      symbol: 'STYOLO',
    });
    console.log(
      '✅ Successfully deployed token module, address:',
      tokenModule.address,
    );
  } catch (error) {
    console.error('failed to deploy token module', error);
  }
})();
