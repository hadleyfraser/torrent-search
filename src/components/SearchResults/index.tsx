import * as React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { isTorrentSelected } from "src/utils";
import { ITorrent } from "src/interfaces";

interface IProps {
  className?: string;
  filter?: string;
  results: ITorrent[];
  downloadTorrents: (torrent: ITorrent[]) => void;
}

interface IState {
  selectedTorrents: ITorrent[];
}

class SearchResultsBase extends React.Component<IProps, IState> {
  public state = {
    selectedTorrents: []
  };

  componentDidUpdate(prevProps) {
    if (!this.props.results.length && prevProps.results.length) {
      this.setState({
        selectedTorrents: []
      });
    }
  }

  handleTorrentClick = (torrent: ITorrent) => e => {
    const { downloadTorrents } = this.props;
    const { selectedTorrents } = this.state;

    if (e.ctrlKey || selectedTorrents.length) {
      this.setState(prevState => {
        let selected = [...prevState.selectedTorrents];
        const torrentPosition = isTorrentSelected(torrent, selected);
        if (torrentPosition !== -1) {
          selected.splice(torrentPosition, 1);
        } else {
          selected.push(torrent);
        }

        return {
          selectedTorrents: selected
        };
      });
    } else {
      downloadTorrents([torrent]);
    }
  };

  downloadAll = () => {
    this.props.downloadTorrents(this.state.selectedTorrents);
  };

  render() {
    const { className, filter, results } = this.props;
    const { selectedTorrents } = this.state;
    return (
      <Paper className={className}>
        {selectedTorrents.length ? (
          <Button
            className="download-all"
            variant="contained"
            color="primary"
            onClick={this.downloadAll}
          >
            Download Selected ({selectedTorrents.length})
          </Button>
        ) : null}
        <Table>
          <colgroup>
            <col />
            <col width="50px" />
            <col width="50px" />
            <col width="50px" />
            <col width="100px" />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell className="name">Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell numeric>Seeders</TableCell>
              <TableCell numeric>Leechers</TableCell>
              <TableCell>Search engine</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results
              .filter(
                torrent =>
                  torrent.peers &&
                  torrent.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map(torrent => (
                <TableRow
                  key={torrent.link}
                  onClick={this.handleTorrentClick(torrent)}
                  className={
                    isTorrentSelected(torrent, selectedTorrents) !== -1
                      ? "selected"
                      : ""
                  }
                >
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
  }
}

const SearchResults = styled(SearchResultsBase)`
  overflow-x: auto;
  position: relative;

  tbody tr {
    transition: all 0.2s;

    &:hover {
      background: #eee;
      cursor: pointer;
    }
  }

  .download-all {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  .selected {
    border: solid blue;
    border-width: 2px 4px;
  }

  [class*="MuiTableCell-numeric"] {
    text-align: center;
  }
`;

export default SearchResults;
