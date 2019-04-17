import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Menu, SavedProvidersList } from "..";

import "react-tabs/style/react-tabs.css";
import "./tabbed-menu.css";

const TabbedMenu = ({selectedTabIndex, selectTab}) => {
  return (
  <Tabs
    className="side-menu"
    selectedIndex={selectedTabIndex}
    onSelect={index => selectTab(index)}
  >
    <TabList>
      <Tab>
        <h3>Service Providers</h3>
      </Tab>
      <Tab>
        <h3>Saved</h3>
      </Tab>
    </TabList>

    <div className="panels">
      <TabPanel>
        <Menu />
      </TabPanel>
      <TabPanel>
        <SavedProvidersList />
      </TabPanel>
    </div>

  </Tabs>
)};

export default TabbedMenu;
