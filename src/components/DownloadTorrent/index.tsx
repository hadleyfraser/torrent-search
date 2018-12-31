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
import { ITorrent } from "src/interfaces";
import { addTorrent } from "src/utils/services";

interface IProps {
  close: () => void;
  torrent: ITorrent;
}
interface IState {
  isAdding: boolean;
  response: string;
  success: boolean;
}

const GreenBox = styled.div`
  color: green;
`;

const RedBox = styled.div`
  color: red;
`;

const DownloadStatus = styled.div`
  margin-top: 20px;
`;

class DownloadTorrent extends React.Component<IProps, IState> {
  public state = {
    isAdding: false,
    response: "",
    success: true
  };

  private addTorrent = (type: string) => async () => {
    const { torrent } = this.props;
    this.setState({
      isAdding: true
    });
    const response = await addTorrent(torrent, type);
    this.setState({
      isAdding: false,
      response: response.data,
      success: response.success
    });
  };

  render() {
    const { close, torrent } = this.props;
    const { isAdding, response, success } = this.state;

    const BoxColor = success ? GreenBox : RedBox;
    const Icon = success ? CheckCircleOutline : ErrorOutline;

    return (
      <Modal open onClose={close}>
        <DialogTitle>
          {isAdding
            ? "Adding torrent to Download Station"
            : "Are you sure you want to download the torrent?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{torrent.name}</DialogContentText>
          <DownloadStatus>
            {isAdding ? (
              <CircularProgress />
            ) : response ? (
              <BoxColor>
                <Icon fontSize="large" />
                <DialogContentText color="inherit">
                  {response}
                </DialogContentText>
              </BoxColor>
            ) : null}
          </DownloadStatus>
        </DialogContent>
        {!isAdding && !response ? (
          <DialogActions>
            <Button
              onClick={this.addTorrent("Movies")}
              color="primary"
              autoFocus
            >
              Download Movie
            </Button>
            <Button onClick={this.addTorrent("TV")} color="primary" autoFocus>
              Download TV Episode
            </Button>
          </DialogActions>
        ) : null}
      </Modal>
    );
  }
}

export default DownloadTorrent;
