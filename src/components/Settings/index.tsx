import * as React from "react";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { ISiteSetting } from "src/interfaces";
import Modal from "src/components/Modal";

interface IProps {
  toggleSite: (
    site: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  hideSettings: () => void;
  sites: ISiteSetting[];
}

const Settings: React.SFC<IProps> = ({ toggleSite, hideSettings, sites }) => (
  <Modal open onClose={hideSettings}>
    <Typography variant="h5" gutterBottom>
      Settings
    </Typography>
    <FormLabel>Active Sites</FormLabel>
    <FormGroup>
      {sites.map(site => (
        <FormControlLabel
          key={site.name}
          control={
            <Switch
              color="primary"
              checked={site.active}
              onChange={toggleSite(site.name)}
            />
          }
          label={site.title}
        />
      ))}
    </FormGroup>
  </Modal>
);

export default Settings;
