import * as React from "react";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "src/components/Modal";
import { verifyLocation } from "src/utils/services";

interface IProps {
  closeModal: () => void;
}

interface IState {
  loading: boolean;
}

class VerifyVPN extends React.Component<IProps, IState> {
  public state = {
    loading: true
  };

  componentDidMount = async () => {
    const { closeModal } = this.props;
    const inAustralia = await verifyLocation();
    if (inAustralia) {
      this.setState({
        loading: false
      });
    } else {
      closeModal();
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Modal open>
        {loading ? (
          <>
            <Typography variant="h5" gutterBottom>
              Verifying VPN
            </Typography>
            <CircularProgress />
          </>
        ) : (
          <Typography variant="h5">No VPN Active</Typography>
        )}
      </Modal>
    );
  }
}

export default VerifyVPN;
