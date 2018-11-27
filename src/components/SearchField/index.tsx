import * as React from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";

const StyledFilterField = styled(props => <TextField {...props} />)`
  width: 250px;
  margin-left: 20px !important;
`;

const Loader = styled(props => <CircularProgress {...props} />)`
  margin-top: 20px;
  margin-left: 20px;
`;

const SearchFieldBase = ({ className, loading, onFilter, ...rest }) => {
  return (
    <div className={className}>
      <TextField label="Search Torrents" margin="normal" fullWidth {...rest} />
      <StyledFilterField
        label="Filter Results"
        margin="normal"
        onChange={onFilter}
      />
      {loading && <Loader />}
    </div>
  );
};

const SearchField = styled(SearchFieldBase)`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export default SearchField;
