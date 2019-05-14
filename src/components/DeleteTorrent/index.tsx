import * as React from "react";

import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";

import { deleteTorrent } from "src/utils/services";
import { getTorrentName } from "src/utils";
import { IDownload } from "../../interfaces";
import Modal from "../Modal";

interface IProps {
  torrent: IDownload;
  closeModal: (torrentList?: IDownload[]) => void;
}

interface IState {
  deleting: boolean;
}

class DeleteModal extends React.Component<IProps> {
  public state: IState = {
    deleting: false
  };

  render() {
    const { torrent, closeModal } = this.props;
    const { deleting } = this.state;

    const cancelDelete = () => {
      closeModal();
    };

    return (
      <Modal open onClose={cancelDelete}>
        <DialogTitle>Are you sure you this torrent?</DialogTitle>
        <DialogContent>
          <DialogContentText align="center">
            {getTorrentName(torrent.source)}
          </DialogContentText>
        </DialogContent>
        {deleting ? (
          <CircularProgress size={25} />
        ) : (
          <DialogActions>
            <Button onClick={this.deleteTorrent} color="primary" autoFocus>
              Delete
            </Button>
            <Button onClick={cancelDelete} color="primary" autoFocus>
              Do not delete
            </Button>
          </DialogActions>
        )}
      </Modal>
    );
  }

  private deleteTorrent = async () => {
    const { closeModal, torrent } = this.props;
    this.setState({
      deleting: true
    });
    const torrentList = await deleteTorrent(torrent);
    closeModal(torrentList.data.data);
  };
}

export default DeleteModal;
