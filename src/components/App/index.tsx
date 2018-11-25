import * as React from "react";
import styled from "styled-components";
import { get_download_url, search } from "src/utils";

interface IProps {
  className?: string;
}

class AppBase extends React.Component<IProps> {
  public componentDidMount() {
    get_download_url(
      "https://1337x.to/torrent/2948745/The-Flash-2014-S04E19-HDTV-x264-SVA-eztv/"
    );
    // search("The Flash");
  }

  public render() {
    const { className } = this.props;
    return <div className={className} />;
  }
}

const App = styled(AppBase)`
  width: 700px;
  max-width: 100%;
  padding: 0 20px;
  margin: 0 auto;
`;

export default App;
