import * as React from "react";
import Modal from "src/components/Modal";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import { EStatus, ITorrent, ITorrentWithStatus } from "src/interfaces";
import { findTorrentToDownload } from "src/utils";
import { addTorrent } from "src/utils/services";
import { string } from "prop-types";

interface IProps {
  className?: string;
  close: () => void;
  torrentList: ITorrent[];
}

interface IState {
  addingTorrents: ITorrentWithStatus[];
}

const IconContainer = styled.div<{ color?: string }>`
  position: absolute;
  top: 0;
  right: 0;
  ${({ color }) => (color ? `color: ${color};` : "")}
`;

const getStatusIcon = (status: EStatus) => {
  let Icon = null;
  let color = "";
  switch (status) {
    case EStatus.ADDING:
      Icon = CircularProgress;
      break;
    case EStatus.ERROR:
      Icon = ErrorOutline;
      color = "red";
      break;
    case EStatus.SUCCESS:
      Icon = CheckCircleOutline;
      color = "green";
      break;
  }

  return Icon ? (
    <IconContainer color={color}>
      <Icon size={20} />
    </IconContainer>
  ) : null;
};

class DownloadTorrentBase extends React.Component<IProps, IState> {
  public state = {
    addingTorrents: []
  };

  private addAllTorrents = (type: string) => () => {
    const { torrentList } = this.props;
    torrentList.forEach(torrent => {
      this.addTorrent(type, torrent);
    });
  };

  private addTorrent = async (type: string, torrent: ITorrent) => {
    this.setState(prevState => ({
      addingTorrents: [
        ...prevState.addingTorrents,
        {
          ...torrent,
          status: EStatus.ADDING
        }
      ]
    }));
    const response = await addTorrent(torrent, type);
    this.setState(prevState => {
      const torrentList = [...prevState.addingTorrents];
      torrentList.map(torr => {
        if (torrent.link === torr.link) {
          torr.status = response.success ? EStatus.SUCCESS : EStatus.ERROR;
        }
        return torr;
      });
      return { addingTorrents: torrentList };
    });
  };

  render() {
    const { className, close, torrentList } = this.props;
    const { addingTorrents } = this.state;

    return (
      <Modal className={className} open onClose={close}>
        <DialogTitle>
          {addingTorrents.length
            ? `Adding torrent${addingTorrents.length === 1} to Download Station`
            : `Are you sure you want to download ${
                addingTorrents.length === 1 ? "the torrent" : "these torrents"
              }?`}
        </DialogTitle>
        <DialogContent>
          {torrentList.map(torrent => {
            const torrentWithStatus = findTorrentToDownload(
              addingTorrents,
              torrent.link
            );

            const status = torrentWithStatus && torrentWithStatus.status;

            return (
              <DialogContentText
                key={torrent.link}
                className="torrent-list"
                align={status !== null ? "left" : "center"}
              >
                {torrent.name}
                {getStatusIcon(status)}
              </DialogContentText>
            );
          })}
        </DialogContent>
        {!addingTorrents.length ? (
          <DialogActions>
            <Button
              onClick={this.addAllTorrents("Movies")}
              color="primary"
              autoFocus
            >
              Download Movie{torrentList.length > 1 ? "s" : ""}
            </Button>
            <Button
              onClick={this.addAllTorrents("TV")}
              color="primary"
              autoFocus
            >
              Download TV Episode{torrentList.length > 1 ? "s" : ""}
            </Button>
          </DialogActions>
        ) : null}
      </Modal>
    );
  }
}

const DownloadTorrent = styled(DownloadTorrentBase)`
  .torrent-list {
    position: relative;
    padding-right: 30px;
  }
`;

export default DownloadTorrent;
