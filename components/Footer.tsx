export const Footer: React.FC = () => {
  return (
    <footer>
      <nav>
        <ul
          sx={{
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(4, 1fr)'],
            placeItems: 'center',
            margin: 0,
            marginTop: '1rem',
            padding: 0,
            gridGap: '1rem',
            '& a': {
              color: '#ffc0cb',
            },
          }}
        >
          <li>
            <a href="https://github.com/nickytonline/structured-yolo-dao">
              source code
            </a>
          </li>
          <li>
            <a href="https://timeline.iamdeveloper.com">about Nick</a>
          </li>
          <li>
            <a href="https://buildspace.so">
              Buildspace <span aria-hidden="true">🦄</span>
            </a>
          </li>
          <li>
            <a href="https://thirdweb.com">ThirdWeb</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
