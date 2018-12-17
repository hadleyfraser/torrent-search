import * as React from "react";
import styled from "styled-components";
import Block from "@material-ui/icons/Block";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { bytesToSize } from "src/utils";
import { clearComplete, getTorrentList } from "src/utils/services";
import { IDownload } from "src/interfaces";
import Modal from "src/components/Modal";
import Action from "src/components/Action";

interface IProps {
  className?: string;
  closeModal: () => void;
}

interface IState {
  isClearing: boolean;
  torrentList: IDownload[];
  updateTimer: NodeJS.Timeout;
}

const Header = styled.div`
  position: relative;
`;

const torrentListTimeout = 1000;
const loaderSize = 25;

class TorrentListBase extends React.Component<IProps, IState> {
  public state = {
    isClearing: false,
    torrentList: [],
    updateTimer: null
  };

  componentDidMount() {
    this.updateTorrentList();
    const updateTimer = setInterval(this.updateTorrentList, torrentListTimeout);
    this.setState({ updateTimer });
  }

  componentWillUnmount() {
    clearInterval(this.state.updateTimer);
  }

  public clearComplete = async () => {
    this.setState({
      isClearing: true
    });
    await clearComplete();
    setTimeout(() => {
      this.setState({
        isClearing: false
      });
    }, 2000);
  };

  render() {
    const { className, closeModal } = this.props;
    const { isClearing, torrentList } = this.state;

    return (
      <Modal open onClose={closeModal}>
        <div className={className}>
          <Header>
            <Typography variant="h5" gutterBottom>
              Currently Downloading
            </Typography>
            <Action
              color="red"
              hardRight
              onClick={!isClearing ? this.clearComplete : null}
            >
              {isClearing ? <CircularProgress size={loaderSize} /> : <Block />}
            </Action>
          </Header>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell numeric>Seeders</TableCell>
                  <TableCell numeric>Leechers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {torrentList.map(torrent => (
                  <TableRow
                    key={torrent.source}
                    className={torrent.progress === 100 ? "complete" : ""}
                  >
                    <TableCell className="name">
                      <span>{torrent.source}</span>
                    </TableCell>
                    <TableCell className="size">
                      {bytesToSize(torrent.size)}
                    </TableCell>
                    <TableCell className="progress">
                      <div>
                        <span style={{ width: `${torrent.progress}%` }} />
                        <span>{torrent.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell numeric>{torrent.seeds}</TableCell>
                    <TableCell numeric>{torrent.peers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </Modal>
    );
  }

  private updateTorrentList = async () => {
    const torrentList = await getTorrentList();
    this.setState({ torrentList });
  };
}

const TorrentList = styled(TorrentListBase)`
  word-break: normal;

  .complete .name {
    color: green;
  }

  .name span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 400px;
    display: block;
  }

  .size {
    white-space: nowrap;
  }

  .progress {
    padding: 0 20px;

    div {
      width: 200px;
      height: 25px;
      line-height: 25px;
      border: solid 1px #ddd;
      position: relative;
      text-align: center;
    }

    span:first-child {
      position: absolute;
      top: 1px;
      left: 1px;
      background: #0090ff;
      height: 100%;
    }

    span + span {
      z-index: 1;
      position: relative;
      width: 100%;
      text-align: center;
      font-weight: bold;
    }
  }

  .MuiTableCell-numeric-97 {
    text-align: center;
  }
`;

export default TorrentList;
