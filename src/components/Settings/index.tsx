import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
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
    <DialogTitle>Settings</DialogTitle>
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
