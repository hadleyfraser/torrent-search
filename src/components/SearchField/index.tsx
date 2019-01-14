import * as React from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IProps {
  className?: string;
  loading: boolean;
  onChange: (e) => void;
  onFilter: (e) => void;
  search: () => void;
  value: string;
}

const Filter = styled.div`
  display: flex;
  width: 200px;
  margin-left: 20px;
`;

const Loader = styled.div`
  margin-top: 30px;
  margin-left: 20px;
`;

const SearchFieldBase: React.SFC<IProps> = ({
  className,
  loading,
  onFilter,
  search,
  ...rest
}) => {
  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      search();
    }
  };

  return (
    <div className={className}>
      <TextField
        label="Search Torrents"
        margin="normal"
        fullWidth
        autoFocus
        onKeyUp={handleSubmit}
        {...rest}
      />
      <Filter>
        <TextField
          label="Filter Results"
          margin="normal"
          onChange={onFilter}
          onKeyUp={handleSubmit}
        />
        {loading && (
          <Loader>
            <CircularProgress size={30} />
          </Loader>
        )}
      </Filter>
    </div>
  );
};

const SearchField = styled(SearchFieldBase)`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export default SearchField;
