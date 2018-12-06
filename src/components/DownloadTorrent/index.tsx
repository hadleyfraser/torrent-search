import * as React from "react";
import Modal from "src/components/Modal";
import styled from "styled-components";
import {
  Button,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from "@material-ui/core";
import { ITorrent } from "src/interfaces";
import { addTorrent } from "src/utils";

interface IProps {
  close: () => void;
  torrent: ITorrent;
}
interface IState {
  isAdding: boolean;
  response: string;
  success: boolean;
}

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
            ) : (
              <>
                <DialogContentText color={success ? "default" : "error"}>
                  {response}
                </DialogContentText>
              </>
            )}
          </DownloadStatus>
        </DialogContent>
        {!isAdding && !response ? (
          <DialogActions>
            <Button
              onClick={this.addTorrent("Movie")}
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
    // return (
    //   <>
    //     <Typography variant="h5" gutterBottom>
    //       {isLoading && "Loading "}Torrent Link
    //     </Typography>
    //     {isLoading ? <CircularProgress /> : downloadUrl}
    //   </>
    // );
  }
}

export default DownloadTorrent;
