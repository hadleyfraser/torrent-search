import * as React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudDownload from "@material-ui/icons/CloudDownload";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";
import * as _ from "lodash";
import { torrentSearch } from "src/utils/services";
import { ISiteSetting, ITorrent } from "src/interfaces";
import SearchResults from "src/components/SearchResults";
import SearchField from "src/components/SearchField";
import Modal from "src/components/Modal";
import VerifyVPN from "src/components/VerifyVPN";
import DownloadTorrent from "src/components/DownloadTorrent";
import TorrentList from "src/components/TorrentList";
import ActionList from "src/components/ActionList";
import Action from "src/components/Action";
import Settings from "src/components/Settings";

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
  selectedTorrents: ITorrent[];
  showDownloads: boolean;
  showModal: boolean;
  showSettings: boolean;
  siteList: ISiteSetting[];
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
    selectedTorrents: null,
    showDownloads: false,
    showModal: false,
    showSettings: false,
    siteList: [
      { title: "1337x", name: "leeks", active: true },
      { title: "Kickass Torrents", name: "kickass", active: true },
      { title: "The Pirate Bay", name: "piratebay", active: true }
    ],
    verifyingVPN: true
  };

  public hideVPNVerification = () => {
    this.setState({
      verifyingVPN: false
    });
  };

  public downloadTorrents = (torrentList: ITorrent[]) => {
    this.setState({
      selectedTorrents: torrentList
    });
  };

  public torrentAdded = () => {
    this.setState({
      selectedTorrents: null
    });
  };

  public hideDownloads = () => {
    this.setState({
      showDownloads: false
    });
  };

  public hideSettings = () => {
    this.setState({ showSettings: false });
  };

  public toggleSiteActive = (siteName: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { siteList } = this.state;
    const newSiteList = _.cloneDeep(siteList);
    newSiteList.forEach(site => {
      if (site.name === siteName) {
        site.active = event.target.checked;
      }
    });
    this.setState({
      siteList: newSiteList
    });
  };

  public render() {
    const { className } = this.props;
    const {
      filter,
      isSearching,
      results,
      search,
      selectedTorrents,
      showDownloads,
      showModal,
      showSettings,
      siteList,
      verifyingVPN
    } = this.state;

    return (
      <div className={className}>
        <header>
          <Typography variant="h3" gutterBottom>
            Torrent Search
          </Typography>
          <ActionList>
            <Action color="#05bb05" onClick={this.showDownloads}>
              <CloudDownload />
            </Action>
            <Action color="#a9a9a9" onClick={this.showSettings}>
              <SettingsIcon />
            </Action>
          </ActionList>
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
                downloadTorrents={this.downloadTorrents}
              />
              <Modal open={!!showModal} onClose={this.hideModal}>
                {!results.length ? <CircularProgress /> : null}
              </Modal>
              {selectedTorrents ? (
                <DownloadTorrent
                  close={this.torrentAdded}
                  torrentList={selectedTorrents}
                />
              ) : null}
            </>
          )}
          {showDownloads && <TorrentList closeModal={this.hideDownloads} />}
          {showSettings && (
            <Settings
              hideSettings={this.hideSettings}
              sites={siteList}
              toggleSite={this.toggleSiteActive}
            />
          )}
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

    const { search, siteList } = this.state;

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
    const activeSites = siteList.filter(site => site.active);

    activeSites.forEach(site => {
      torrentSearch(search, site.name).then(response => {
        this.addResults(response);
        sitesComplete++;
        if (sitesComplete === activeSites.length) {
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

  private showSettings = () => {
    this.setState({
      showSettings: true
    });
  };

  private handleFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState({ filter: (e.target as HTMLInputElement).value });
  };
}

const App = styled(AppBase)`
  header {
    z-index: 2000;
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
