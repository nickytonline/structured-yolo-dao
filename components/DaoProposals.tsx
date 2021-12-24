import { Proposal } from '@3rdweb/sdk';
import { Button } from '@components/Button';

export const DaoProposals: React.FC<{
  proposals: Proposal[];
  vote: () => void;
  votingState: 'voting' | 'voted' | 'vote';
}> = ({ proposals, vote, votingState }) => {
  return (
    <div>
      <h2>Active Proposals</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          votingState !== 'voted' && vote();
        }}
      >
        {proposals.map((proposal) => (
          <div className="card" key={proposal.proposalId}>
            {votingState !== 'voted' ? (
              <>
                <fieldset
                  sx={{
                    border: 'none',
                    '& label': { marginRight: '8px' },
                  }}
                >
                  <legend sx={{ fontWeight: 700 }}>
                    {proposal.description}
                  </legend>
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
              </>
            ) : (
              <>
                <h3 sx={{ fontSize: 'inherit' }}>{proposal.description}</h3>
                <p sx={{ fontStyle: 'italic' }}>
                  Voted: {proposal.votes.find((vote) => vote.type === 2)!.label}
                </p>
              </>
            )}
          </div>
        ))}
        {votingState !== 'voted' ? (
          <>
            <Button type="submit">
              {votingState === 'voting' ? 'Voting...' : 'Submit Votes'}
            </Button>
            <span sx={{ marginLeft: '8px' }}>
              This will trigger multiple transactions that you will need to
              sign.
            </span>
          </>
        ) : null}
      </form>
    </div>
  );
};
