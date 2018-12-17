import * as React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Typography from "@material-ui/core/Typography";
import * as _ from "lodash";
import { torrentSearch } from "src/utils/services";
import { ITorrent } from "src/interfaces";
import SearchResults from "src/components/SearchResults";
import SearchField from "src/components/SearchField";
import Modal from "src/components/Modal";
import VerifyVPN from "src/components/VerifyVPN";
import DownloadTorrent from "src/components/DownloadTorrent";
import TorrentList from "src/components/TorrentList";
import Action from "src/components/Action";

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
  showDownloads: boolean;
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
    showDownloads: true,
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

  public hideDownloads = () => {
    this.setState({
      showDownloads: false
    });
  };

  public render() {
    const { className } = this.props;
    const {
      filter,
      isSearching,
      results,
      search,
      selectedTorrent,
      showDownloads,
      showModal,
      verifyingVPN
    } = this.state;

    return (
      <div className={className}>
        <header>
          <Typography variant="h3" gutterBottom>
            Torrent Search
          </Typography>
          <Action
            onClick={this.showDownloads}
            color="#05bb05"
            hoverColor="#069c06"
          >
            <CloudDownload />
          </Action>
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
          {showDownloads && <TorrentList closeModal={this.hideDownloads} />}
        </main>
      </div>
    );
  }

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

  private showDownloads = () => {
    this.setState({
      showDownloads: true
    });
  };

  private handleFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState({ filter: (e.target as HTMLInputElement).value });
  };
}

const App = styled(AppBase)`
  header {
    position: relative;
    padding-top: 10px;
    background: #eee;
    text-align: center;
    border-bottom: solid 2px #ccc;
  }

  main {
    padding: 0 20px;
  }
`;

export default App;
