import type { NextPage } from 'next';
import { Header } from '@components/Header';
import { Wallet } from '@components/Wallet';
import { useWeb3WithEns } from 'utilities/hooks';
import { Proposal, ThirdwebSDK } from '@3rdweb/sdk';
import {
  BUNDLE_DROP_ADDRESS,
  TOKEN_MODULE_ADDRESS,
  VOTE_MODULE_ADDRESS,
} from 'utilities/addresses';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@components/Button';
import { BigNumberish, ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import { getMissingMetamaskMessage } from 'utilities/metamask';
import 'react-toastify/dist/ReactToastify.css';
import { DaoMembers } from '@components/DaoMembers';
import { DaoProposals } from '@components/DaoProposals';
import { Footer } from '@components/Footer';

function shortenAddress(address: string) {
  return (
    address.substring(0, 6) + '...' + address.substring(address.length - 4)
  );
}

const sdk = new ThirdwebSDK('rinkeby');

// Grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(TOKEN_MODULE_ADDRESS);
const voteModule = sdk.getVoteModule(VOTE_MODULE_ADDRESS);

const DEFAULT_AVATAR = '/assets/default-avatar.svg';

const Home: NextPage = () => {
  const { connectWallet, address, avatar, domainName, error, provider } =
    useWeb3WithEns();

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // Amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<
    Record<string, BigNumberish>
  >({});

  // All of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider?.getSigner();

  useEffect(() => {
    if (!window.ethereum) {
      toast.error(getMissingMetamaskMessage());
      return;
    }

    setHasMetaMask(true);
  }, []);

  useEffect(() => {
    if (error?.name === 'UnsupportedChainIdError') {
      toast.error(
        `This dapp only works on the Rinkeby network, please switch networks in your connected wallet.`,
        { autoClose: false },
      );
    }
  }, [error]);

  // This useEffect grabs all our the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresess) => {
        console.log('🚀 Members addresses', addresess);
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error('failed to get member list', err);
        toast.error('Failed to get member list');
      });
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log('👜 Amounts', amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error('failed to get token amounts', err);
        toast.error('Failed to get token amounts');
      });
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!address) {
      // No wallet connected.
      return;
    }

    bundleDropModule
      .balanceOf(address, '0')
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error('failed to nft balance', error);
        toast.error('Failed to get NFT balance');
      });
  }, [address]);

  useEffect(() => {
    signer && sdk.setProviderOrSigner(signer);
  }, [signer]);

  // Retreive all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log('🌈 Proposals:', proposals);
      })
      .catch((err) => {
        console.error('failed to get proposals', err);
        toast.error('Failed to get proposals');
      });
  }, [hasClaimedNFT]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT || !address) {
      return;
    }

    // If we haven't finished retreieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    // Check if the user has already voted on the first proposal.
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        console.log('🥵 User has already voted');
      })
      .catch((err) => {
        console.error('failed to check if member has voted', err);
        toast.error('Failed to check if member has voted');
      });
  }, [hasClaimedNFT, proposals, address]);

  const mintNft = async () => {
    if (!address) {
      return;
    }

    const toastId = address;
    setIsClaiming(true);
    toast.info('🔨 Minting NFT...', { toastId, autoClose: false });

    try {
      // Mint an NFT to the user's wallet.
      await bundleDropModule.claim('0', 1);
      setHasClaimedNFT(true);
      toast.info(
        <p>
          <span aria-hidden="true">🌊</span> Successfully Minted! Check out{' '}
          <a
            href="https://testnets.opensea.io/assets/${bundleDropModule.address}/0"
            target="__opensea__"
          >
            your minted NFT on OpenSea
          </a>
        </p>,
        { autoClose: false },
      );
    } catch (err) {
      console.error('failed to claim', err);
      toast.error(`💥 Failed to mint NFT. Please try again.`);
    } finally {
      setIsClaiming(false);
      toast.dismiss(toastId);
    }
  };

  async function vote() {
    if (!address || isVoting || hasVoted) {
      return;
    }

    const toastId = address;

    //before we do async things, we want to disable the button to prevent double clicks
    setIsVoting(true);
    toast.info('🔨 Voting...', { toastId, autoClose: false });

    // lets get the votes from the form for the values
    const votes = proposals.map((proposal) => {
      let voteResult = {
        proposalId: proposal.proposalId,
        //abstain by default
        vote: 2,
      };

      proposal.votes.forEach((vote) => {
        const elem = document.getElementById(
          proposal.proposalId + '-' + vote.type,
        ) as HTMLInputElement;

        if (elem.checked) {
          voteResult.vote = vote.type;
          return;
        }
      });
      return voteResult;
    });

    // first we need to make sure the user delegates their token to vote
    try {
      //we'll check if the wallet still needs to delegate their tokens before they can vote
      const delegation = await tokenModule.getDelegationOf(address);
      // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
      if (delegation === ethers.constants.AddressZero) {
        //if they haven't delegated their tokens yet, we'll have them delegate them before voting
        await tokenModule.delegateTo(address);
      }
      // then we need to vote on the proposals
      try {
        await Promise.all(
          votes.map(async (vote) => {
            // before voting we first need to check whether the proposal is open for voting
            // we first need to get the latest state of the proposal
            const proposal = await voteModule.get(vote.proposalId);
            // then we check if the proposal is open for voting (state === 1 means it is open)
            if (proposal.state === 1) {
              // if it is open for voting, we'll vote on it
              return voteModule.vote(vote.proposalId, vote.vote);
            }
            // if the proposal is not open for voting we just return nothing, letting us continue
            return;
          }),
        );

        try {
          // if any of the propsals are ready to be executed we'll need to execute them
          // a proposal is ready to be executed if it is in state 4
          await Promise.all(
            votes.map(async (vote) => {
              // we'll first get the latest state of the proposal again, since we may have just voted before
              const proposal = await voteModule.get(vote.proposalId);

              //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
              if (proposal.state === 4) {
                return voteModule.execute(vote.proposalId);
              }
            }),
          );
          // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
          setHasVoted(true);
          // and log out a success message
          console.log('successfully voted');
          toast.success('🎉 Successfully voted!');
        } catch (err) {
          console.error('failed to execute votes', err);
          toast.error('Failed to execute votes');
        }
      } catch (err) {
        console.error('failed to vote', err);
        toast.error('Failed to vote');
      }
    } catch (err) {
      console.error('failed to delegate tokens');
      toast.error('Failed to delegate tokens');
    } finally {
      // in *either* case we need to set the isVoting state to false to enable the button again
      setIsVoting(false);
      toast.dismiss(toastId);
    }
  }

  const votingState = hasVoted ? 'voted' : isVoting ? 'voting' : 'vote';
  const displayContents =
    hasMetaMask && address && error?.name !== 'UnsupportedChainIdError';

  return (
    <>
      <header
        sx={{
          margin: '1rem',
          display: 'grid',
          gap: '0.25rem',
          gridTemplateAreas: '". . wallet" "header header header"',
          placeItems: 'center',
        }}
      >
        <div sx={{ gridArea: 'wallet' }}>
          <Wallet
            connectWallet={() => connectWallet('injected')}
            account={address}
            domainName={domainName}
            avatar={avatar ?? DEFAULT_AVATAR}
          />
        </div>
        <div sx={{ gridArea: 'header' }}>
          <Header />
        </div>
      </header>
      <main sx={{ margin: '16px' }}>
        <ToastContainer />
        {displayContents ? (
          hasClaimedNFT ? (
            <div>
              <h1>🍪 DAO Member Page</h1>
              <p>
                <em>You&apos;re in friend!</em> Congrats on being a member of
                the DAO!
              </p>
              <DaoMembers members={memberList} />
              <DaoProposals
                proposals={proposals}
                vote={vote}
                votingState={votingState}
              />
            </div>
          ) : (
            <Button onClick={() => !isClaiming && mintNft()}>
              {isClaiming ? 'Minting...' : `Mint your NFT (It's free!)`}
            </Button>
          )
        ) : null}
      </main>
      <Footer />
    </>
  );
};

export default Home;
