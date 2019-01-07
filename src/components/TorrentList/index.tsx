import * as React from "react";
import styled from "styled-components";
import { sumBy } from "lodash";
import Block from "@material-ui/icons/Block";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  bytesToSize,
  secondsToTime,
  getTorrentStatus,
  getNameFromMagent
} from "src/utils";
import {
  changeTorrentStatus,
  clearComplete,
  getTorrentList
} from "src/utils/services";
import { taskStatus } from "src/constants";
import { IDownload } from "src/interfaces";
import Modal from "src/components/Modal";
import Action from "src/components/Action";
import ActionList from "../ActionList";

interface IProps {
  className?: string;
  closeModal: () => void;
}

interface IState {
  isClearing: boolean;
  initialLoad: boolean;
  isLoading: boolean;
  torrentList: IDownload[];
}

const Header = styled.div`
  position: relative;
`;

const torrentListTimeout = 1000;
const loaderSize = 25;

class TorrentListBase extends React.Component<IProps, IState> {
  private mounted = false;
  public state = {
    isClearing: false,
    initialLoad: true,
    isLoading: false,
    torrentList: []
  };

  componentDidMount() {
    this.mounted = true;
    this.updateTorrentList();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  public clearComplete = async () => {
    this.setState({
      isClearing: true
    });

    const torrentList = await clearComplete();
    if (!this.mounted) {
      return;
    }

    this.updateTorrentList();

    this.setState({
      isClearing: false,
      torrentList: torrentList.data.data
    });
  };

  render() {
    const { className, closeModal } = this.props;
    const { isClearing, initialLoad, isLoading, torrentList } = this.state;

    const showSpinner = isClearing || isLoading || initialLoad;

    return (
      <Modal open onClose={closeModal}>
        <div className={className}>
          <Header>
            <Typography variant="h5" gutterBottom>
              Currently Downloading
            </Typography>
            <ActionList hardRight>
              <Action
                color="red"
                onClick={!showSpinner ? this.clearComplete : null}
              >
                {showSpinner ? (
                  <CircularProgress size={loaderSize} />
                ) : (
                  <Block />
                )}
              </Action>
            </ActionList>
          </Header>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Download Rate</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell numeric>Seeders</TableCell>
                  <TableCell numeric>Leechers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {torrentList &&
                  torrentList.map((torrent: IDownload) => {
                    const progress =
                      torrent.state === 100 ? 100 : torrent.progress;
                    const complete = progress === 100;

                    let name = torrent.source;
                    if (name.indexOf("magnet:") !== -1) {
                      name = `magnet: ${getNameFromMagent(name)}`;
                    }

                    let torrentStatusClass = "incomplete";
                    if (torrent.state === taskStatus.failed) {
                      torrentStatusClass = "failed";
                    } else if (complete) {
                      torrentStatusClass = "complete";
                    }

                    return (
                      <TableRow
                        key={torrent.source}
                        className={torrentStatusClass}
                        onClick={
                          !complete ? this.handleTorrentClick(torrent) : null
                        }
                      >
                        <TableCell className="name">
                          <span>{name}</span>
                        </TableCell>
                        <TableCell className="size">
                          {bytesToSize(torrent.size)}
                        </TableCell>
                        <TableCell className="size">
                          {bytesToSize(torrent.down_rate)}/s
                        </TableCell>
                        <TableCell className="progress">
                          <div>
                            <span
                              style={{
                                width: `${progress}%`
                              }}
                            />
                            <span>
                              {getTorrentStatus(torrent) || `${progress}%`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell numeric>
                          {torrent.eta > 0 ? secondsToTime(torrent.eta) : 0}
                        </TableCell>
                        <TableCell numeric>{torrent.seeds}</TableCell>
                        <TableCell numeric>{torrent.peers}</TableCell>
                      </TableRow>
                    );
                  })}
                {!initialLoad && torrentList && torrentList.length && (
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <strong>Total Rate</strong>
                    </TableCell>
                    <TableCell className="size">
                      {bytesToSize(sumBy(torrentList, "down_rate"))}/s
                    </TableCell>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </Modal>
    );
  }

  private updateTorrentList = async () => {
    const torrentList = await getTorrentList();
    torrentList;
    if (!this.mounted || this.state.isClearing) {
      return;
    }
    this.setState({ torrentList: torrentList.data.data, initialLoad: false });
    setTimeout(this.updateTorrentList, torrentListTimeout);
  };

  private handleTorrentClick = (torrent: IDownload) => async () => {
    this.setState({ isLoading: true });
    const torrentList = await changeTorrentStatus(torrent);
    this.setState({ isLoading: false, torrentList: torrentList.data.data });
  };
}

const TorrentList = styled(TorrentListBase)`
  word-break: normal;

  tr {
    transition: 0.2s all;
  }

  .incomplete,
  .failed {
    &:hover {
      background: #eee;
      cursor: pointer;
    }
  }

  .complete {
    .name {
      color: green;
    }

    .progress span:first-child {
      background: #069c06;
    }
  }

  .failed {
    .name {
      color: red;
    }

    .progress span:first-child {
      background: red;
    }
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

  [class*="MuiTableCell-numeric"] {
    text-align: center;
  }
`;

export default TorrentList;
