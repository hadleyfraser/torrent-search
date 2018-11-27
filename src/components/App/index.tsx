import * as React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as _ from "lodash";
import { getTorrentUrl, torrentSearch, verifyLocation } from "src/utils";
import { ITorrent } from "src/interfaces";
import SearchResults from "src/components/SearchResults";
import SearchField from "src/components/SearchField";

const sites = ["piratebay", "leeks", "kickass"];

interface IProps {
  className?: string;
}

interface IState {
  downloadUrl: string;
  filter: string;
  inAustralia: boolean;
  isLoading: boolean;
  isSearching: boolean;
  results: ITorrent[];
  resultsFound: boolean;
  search: string;
  showModal: boolean;
}

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 5px;
  padding: 15px;
  outline: 0;
  text-align: center;
  word-break: break-all;
`;

class AppBase extends React.Component<IProps, IState> {
  state = {
    downloadUrl: "",
    filter: "",
    inAustralia: null,
    isLoading: true,
    isSearching: false,
    results: [],
    resultsFound: false,
    search: "",
    showModal: true
  };

  componentDidMount = async () => {
    const inAustralia = await verifyLocation();
    this.setState({ inAustralia, isLoading: false, showModal: false });
  };

  public showModal = async (torrent: ITorrent) => {
    this.setState({
      isLoading: true,
      showModal: true
    });
    const downloadUrl = await getTorrentUrl(torrent);
    this.setState({
      downloadUrl,
      isLoading: false
    });
  };

  private hideModal = () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({
      showModal: false
    });
  };

  private handleSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState({ search: (e.target as HTMLInputElement).value });
  };

  private handleSubmit = async () => {
    this.setState({
      results: []
    });

    const { search } = this.state;

    if (!search) {
      return;
    }

    this.setState({
      isLoading: true,
      results: [],
      showModal: true,
      isSearching: true
    });
    let sitesComplete = 0;
    sites.forEach((site, index) => {
      torrentSearch(search, site).then(response => {
        this.addResults(response);
        sitesComplete++;
        if (sitesComplete === sites.length) {
          this.setState({
            isSearching: false
          });
        }
      });
    });
  };

  private addResults = (torrentList: ITorrent[]) => {
    if (!torrentList) {
      return;
    }
    this.setState(({ results }) => {
      let allResults = _.chain(results)
        .concat(torrentList)
        .orderBy("seeds", "desc")
        .value();

      return {
        isLoading: false,
        resultsFound: true,
        showModal: false,
        results: allResults
      };
    });
  };

  private handleFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState({ filter: (e.target as HTMLInputElement).value });
  };

  public render() {
    const { className } = this.props;
    const {
      downloadUrl,
      filter,
      inAustralia,
      isLoading,
      isSearching,
      results,
      search,
      showModal
    } = this.state;

    const inAusOrVerifying = inAustralia || inAustralia === null;

    return (
      <div className={className}>
        <header>
          <Typography variant="h3" gutterBottom>
            Torrent Search
          </Typography>
        </header>
        <main>
          {inAusOrVerifying ? (
            <Modal open={inAusOrVerifying}>
              <ModalContent>
                {inAustralia === null ? (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Verifying VPN
                    </Typography>
                    <CircularProgress />
                  </>
                ) : (
                  <Typography variant="h5">No VPN Active</Typography>
                )}
              </ModalContent>
            </Modal>
          ) : (
            <>
              <SearchField
                loading={isSearching}
                onKeyUp={e => e.keyCode === 13 && this.handleSubmit()}
                onChange={this.handleSearchChange}
                onFilter={this.handleFilter}
                value={search}
              />
              <SearchResults
                filter={filter}
                results={results}
                showModal={this.showModal}
              />
              <Modal open={!!showModal} onClose={this.hideModal}>
                <ModalContent>
                  {!results.length ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <Typography variant="h5" gutterBottom>
                        {isLoading && "Loading "}Torrent Link
                      </Typography>
                      {isLoading ? <CircularProgress /> : downloadUrl}
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </main>
      </div>
    );
  }
}

const App = styled(AppBase)`
  header {
    text-align: center;
    border-bottom: solid 2px #ccc;
    padding-top: 10px;
    background: #eee;
  }

  main {
    padding: 0 20px;
  }
`;

export default App;
