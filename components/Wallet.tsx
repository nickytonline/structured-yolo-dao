import { Maybe } from '@metamask/providers/dist/utils';
import { EtherscanLink } from '@components/EtherscanLink';
import { Button } from '@components/Button';
import Image from 'next/image';

export const Wallet: React.FC<{
  account: Maybe<string>;
  domainName: string | null;
  avatar: string;
  connectWallet: () => void;
}> = ({ account, domainName, connectWallet, avatar }) => {
  return (
    <div>
      {account ? (
        <EtherscanLink
          address={account}
          domainName={domainName}
          avatar={avatar}
        />
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
};
