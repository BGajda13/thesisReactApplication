import React from "react";
import { Drawer, Tabs, Tab, Paper, Container } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import EmojiPeopleRoundedIcon from "@material-ui/icons/EmojiPeopleRounded";
import { green } from "@material-ui/core/colors";
import { Typography } from "@material-ui/core";
import TabPanel from "./TabPanel";
import PersonTab from "./PersonTab";
import Divider from "@material-ui/core/Divider";
import RelationsTab from "./RelationsTab";
import Input from '@material-ui/core/Input';

import { MyContext, closeDrawer, changeSelectedTab } from "../MyContext";

function Menu() {
  const [state, setState] = React.useContext(MyContext);

  return (
    <Drawer open={state.showMenu} variant="persistent" id="drawer">
      <Container>
        <IconButton
          onClick={() => {
            closeDrawer(setState);
          }}
        >
          <ChevronLeftIcon />
          <Typography> Zamknij</Typography>
        </IconButton>
      </Container>
      <Paper square>
        <Tabs
          value={state.selectedTab}
          onChange={(e, selectedTab) => {
            changeSelectedTab(setState, selectedTab);
          }}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="Options tab"
        >
          <Tab
            icon={<EmojiPeopleRoundedIcon fontSize="large" />}
            style={{ color: green[500] }}
            label={<Typography variant="subtitle2">Osoby</Typography>}
          />
          <Tab
            icon={<GroupIcon fontSize="large" />}
            label={<Typography variant="subtitle2">Relacje</Typography>}
          />
          <Tab
            icon={<SettingsIcon fontSize="large" />}
            label={<Typography variant="subtitle2">Ustawienia</Typography>}
          />
        </Tabs>
        <Divider m={5} />
        <TabPanel value={state.selectedTab} index={0}>
          <PersonTab />
        </TabPanel>
        <TabPanel value={state.selectedTab} index={1}>
          <RelationsTab />
        </TabPanel>
        <TabPanel value={state.selectedTab} index={2}>
          
        </TabPanel>
      </Paper>
    </Drawer>
  );
}

export default Menu;
