import { useEffect, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';

export function useWeb3WithEns() {
  const [domainName, setDomainName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const { connectWallet, address, error, provider } = useWeb3();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (provider && address) {
        // https://gist.github.com/nickytonline/8103a5cebc2c02d517af199fc1d46af0
        const ensDomain = await provider.lookupAddress(address);
        setDomainName(ensDomain);
        setWalletAddress(address);

        if (!ensDomain) {
          return;
        }

        const avatar = await provider.getAvatar(ensDomain);
        setAvatar(avatar);
      }
    })();
  }, [address, provider, setDomainName]);

  return {
    connectWallet,
    address: walletAddress,
    avatar,
    error,
    provider,
    domainName,
  };
}
