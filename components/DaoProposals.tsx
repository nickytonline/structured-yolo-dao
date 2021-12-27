import { Proposal, ProposalVote } from '@3rdweb/sdk';
import { Button } from '@components/Button';

type VotingState = 'voting' | 'voted' | 'vote';

function getSubmitButtonText(votingState: VotingState) {
  switch (votingState) {
    case 'voting':
      return 'Voting...';
    case 'voted':
      return 'Already voted';
    case 'vote':
      return 'Vote';
    default:
      throw new Error('Unknown voting state');
  }
}

function getVoteLabel(votingState: VotingState) {
  if (votingState === 'voted') {
    return 'You voted';
  } else {
    return 'Vote:';
  }
}

export const DaoProposals: React.FC<{
  proposals: Proposal[];
  vote: () => void;
  votingState: VotingState;
}> = ({ proposals, vote, votingState }) => {
  const disabled = votingState === 'voted' ? { 'aria-disabled': true } : {};

  return (
    <div className="stack" aria-live="polite">
      <h2>Active Proposals</h2>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          votingState !== 'voted' && vote();
        }}
      >
        {proposals.map((proposal) => (
          <details className="card" key={proposal.proposalId}>
            <summary sx={{ fontWeight: 700, userSelect: 'none' }}>
              {proposal.description}
            </summary>
            {
              <fieldset
                sx={{
                  display: 'flex',
                  gap: '0.5rem',
                  border: 'none',
                }}
                {...disabled}
              >
                <legend>{getVoteLabel(votingState)}</legend>
                {proposal.votes.map((vote) => (
                  <label
                    htmlFor={proposal.proposalId + '-' + vote.type}
                    key={vote.type}
                  >
                    <input
                      type="radio"
                      id={proposal.proposalId + '-' + vote.type}
                      name={proposal.proposalId}
                      value={vote.type}
                      defaultChecked={vote.type === 2}
                    />
                    {vote.label}
                  </label>
                ))}
              </fieldset>
            }
          </details>
        ))}
        <>
          <Button {...disabled} type="submit">
            {getSubmitButtonText(votingState)}
          </Button>
          <span sx={{ marginLeft: '8px' }}>
            This will trigger multiple transactions that you will need to sign.
          </span>
        </>
      </form>
    </div>
  );
};
