import * as React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import * as _ from "lodash";
import { torrentSearch } from "src/utils";
import { ITorrent } from "src/interfaces";
import SearchResults from "src/components/SearchResults";
import SearchField from "src/components/SearchField";
import Modal from "src/components/Modal";
import VerifyVPN from "src/components/VerifyVPN";
import DownloadTorrent from "src/components/DownloadTorrent";

const sites = ["leeks", "kickass"];

interface IProps {
  className?: string;
}

interface IState {
  filter: string;
  isLoading: boolean;
  isSearching: boolean;
  results: ITorrent[];
  resultsFound: boolean;
  search: string;
  selectedTorrent: ITorrent;
  showModal: boolean;
  verifyingVPN: boolean;
}

class AppBase extends React.Component<IProps, IState> {
  public state = {
    filter: "",
    isLoading: false,
    isSearching: false,
    results: [],
    resultsFound: false,
    search: "",
    selectedTorrent: null,
    showModal: false,
    verifyingVPN: true
  };

  public hideVPNVerification = () => {
    this.setState({
      verifyingVPN: false
    });
  };

  public downloadTorrent = async (torrent: ITorrent) => {
    this.setState({
      selectedTorrent: torrent
    });
  };

  public torrentAdded = () => {
    this.setState({
      selectedTorrent: null
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
      isSearching: true,
      results: [],
      showModal: true
    });
    let sitesComplete = 0;
    sites.forEach(site => {
      torrentSearch(search, site).then(response => {
        this.addResults(response);
        sitesComplete++;
        if (sitesComplete === sites.length) {
          this.setState({
            isSearching: false,
            isLoading: false,
            showModal: false
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
      filter,
      isSearching,
      results,
      search,
      selectedTorrent,
      showModal,
      verifyingVPN
    } = this.state;

    return (
      <div className={className}>
        <header>
          <Typography variant="h3" gutterBottom>
            Torrent Search
          </Typography>
        </header>
        <main>
          {verifyingVPN ? (
            <VerifyVPN closeModal={this.hideVPNVerification} />
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
                downloadTorrent={this.downloadTorrent}
              />
              <Modal open={!!showModal} onClose={this.hideModal}>
                {!results.length ? <CircularProgress /> : null}
              </Modal>
              {selectedTorrent ? (
                <DownloadTorrent
                  close={this.torrentAdded}
                  torrent={selectedTorrent}
                />
              ) : null}
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
