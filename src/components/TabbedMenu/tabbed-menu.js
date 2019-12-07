import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ProviderList, SavedProvidersList } from "components";

import "react-tabs/style/react-tabs.css";
import "./tabbed-menu.css";

function Counter({count}) {
  if (count > 0) {
    return <span id="provider-counter">{count}</span>
  } else {
    return null;
  }
}

const TabbedMenu = ({ savedProviderCount, selectedTabIndex, selectTab }) => {
  return (
    <Tabs
      className="side-menu"
      selectedIndex={selectedTabIndex}
      onSelect={index => selectTab(index)}
      selectedTabPanelClassName="selected-tab-panel"
    >
      <TabList>
        <Tab>
          <h3>Service Providers</h3>
        </Tab>
        <Tab>
          <h3>
            Saved
            <Counter count={savedProviderCount} />
          </h3>
        </Tab>
      </TabList>

      <TabPanel>
        <ProviderList />
      </TabPanel>
      <TabPanel>
        <SavedProvidersList />
      </TabPanel>
    </Tabs>
  );
};

export default TabbedMenu;
