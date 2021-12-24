import { Member } from 'types/Member';
import { shortenAddress } from 'utilities/addresses';

export const DaoMembers: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <div>
      <h2>Member List</h2>
      <table className="card">
        <thead>
          <tr sx={{ '& th': { textAlign: 'left' } }}>
            <th>Address</th>
            <th>Token Amount</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            return (
              <tr key={member.address}>
                <td>{shortenAddress(member.address)}</td>
                <td>{member.tokenAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
