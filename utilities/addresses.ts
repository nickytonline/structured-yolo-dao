export function shortenAddress(address: string) {
  return (
    address.substring(0, 6) + '...' + address.substring(address.length - 4)
  );
}

export const BUNDLE_DROP_ADDRESS = '0xB6E4932F848A337Ad5FDDfD8a3113fAF90024312';
export const TOKEN_MODULE_ADDRESS =
  '0xB7e1a5175aacaf7f30A09Bca1dD54e1b94E63Fb4';
export const VOTE_MODULE_ADDRESS = '0x416aEa07Ef3C4e0C6A425c22f1e75B0B5886E12F';
