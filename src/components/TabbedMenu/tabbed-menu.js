import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Menu, SavedProvidersList } from "..";

import "react-tabs/style/react-tabs.css";
import "./tabbed-menu.css";

const TabbedMenu = () => (
    <Tabs className="side-menu">
        <TabList>
            <Tab><h3>Service Providers</h3></Tab>
            <Tab><h3>Saved</h3></Tab>
        </TabList>

        <div className="panels">
        <TabPanel>
            <Menu/>
        </TabPanel>
        <TabPanel>
            <SavedProvidersList/>
        </TabPanel>
        </div>
    </Tabs>
) 

export default TabbedMenu;