import * as React from "react";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { ITorrent } from "src/interfaces";

interface IProps {
  className?: string;
  filter?: string;
  results: ITorrent[];
  showModal: (torrent: ITorrent) => void;
}

const SearchResultsBase: React.SFC<IProps> = ({
  className = "",
  filter = "",
  results,
  showModal
}) => (
  <Paper className={className}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Size</TableCell>
          <TableCell numeric>Seeders</TableCell>
          <TableCell numeric>Leechers</TableCell>
          <TableCell>Search engine</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results
          .filter(torrent =>
            torrent.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map(torrent => (
            <TableRow key={torrent.link} onClick={() => showModal(torrent)}>
              <TableCell>{torrent.name}</TableCell>
              <TableCell>{torrent.sizeText}</TableCell>
              <TableCell numeric>{torrent.seeds}</TableCell>
              <TableCell numeric>{torrent.peers}</TableCell>
              <TableCell>{torrent.src}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </Paper>
);

const SearchResults = styled(SearchResultsBase)`
  tbody tr {
    transition: all 0.2s;

    &:hover {
      background: #eee;
      cursor: pointer;
    }
  }
`;

export default SearchResults;
