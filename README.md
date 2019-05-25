# Migrant Service Map

### Migrant Service Map-MSM Project

(start date 9.13.18)

### by [Refugees Welcome](https://refugeeswelcomehome.org/)!

### Partners: MapBox and Code for Boston

Thanks for choosing to support our initiative to support and strengthen migrant service provision in the greater Boston area. For more information about our organization, vist [Refugees Welcome](https://refugeeswelcomehome.org/).

### Project Lead:

- Charla M. Burnett ([Refugees Welcome](https://refugeeswelcomehome.org/)) charla.burnett89@gmail.com

### MapBox Support:

- Marena Brinkhurst marena.brinkhurst@mapbox.com
- Sam Fader sam.fader@mapbox.com
- Mall Wood mal.wood@mapbox.com,
- Joe Clark joe.clark@mapbox.com,

### Code for Boston Support:

- Liam Morley liam@codeforboston.org
- Matt mattz@codeforboston.org

## Project Materials and Communications

- Slack Channel: #migrantservicemap
  - [Join Code for Boston's Slack Workplace](https://communityinviter.com/apps/cfb-public/code-for-boston)
- [Project Board](https://github.com/codeforboston/migrant_service_map/projects/1)
- [Weekly Meeting Minutes](https://docs.google.com/document/d/1Q4KbIK_mSc1YiAWd6nZ9qgy0cJgI_m5sBXKJMqfagHo/edit?usp=sharing)
- [Draft Link](https://bl.ocks.org/malwoodsantoro/raw/bb965255726264a1187d0de845f32c41/)
- [Database](https://docs.google.com/spreadsheets/d/1yuYBtejcDPPxkY3ogHkqGEp7h3RrZ_3B2SUsraASWcs/edit?usp=sharing)

## Summary

The Migrant Service Map (MSM) was conceptualized as a part of our ongoing research on streamlining migrant services in Boston. The objective of the map is to act as a spatial guide for migrants and service providers to find specific types of services closest to them and their clients. The database would include a comprehensive list of all service providers and services offered desegregated by service type and migrant status. The data on service providers in Boston has already been collected by Refugees Welcome! and is geocoded.

## Features

The migrant or service provider would needs to be able to click on the MSM link and be transferred to a questionnaire page where they would be asked whether they are service providers or migrants. The next page would ask the service provider if they have become a part of our network and offer a separate link to apply to the RW! Network. This page would also ask what the legal status is of their client, the address of the client, and what types of services they are looking for. The legal status is important because undocumented and asylum seekers cannot receive all public services.

The types of services include, housing, work placement, english, legal assistance, registration, health, mental health, community centers, and education. The map would conduct a spatial analysis to highlight each service provider within .5, 1, 3, and 5 miles of the address entered for whichever legal status and service applies to their search. The migrant or service provider will be able to click on the service provider points and is provided with a comprehensive overview of the services provided and contact information. This tool will be used by service providers and migrants to find and plan the integration of new arrivals to Boston. As a result, it would be helpful if the platform could keep a record of each point of interest that then could be easily printed. That way service providers can give clients an easy list of service providers to contact upon arrival.

## Getting Started

### Prerequisites

#### Node

If you don't have nodejs installed, [install it](https://nodejs.org/en/download/). If you don't know, do `node --version` in your terminal/command prompt. If you don't get a number, you don't have it.

#### Git and Github

If you're new to github check out [Github Guide, Hello World](https://guides.github.com/activities/hello-world/) to make an account and get started with Github and [How to: fork a repo](https://help.github.com/articles/fork-a-repo/) to learn how to fork a repo.

### Setup

1. Fork the repository: On GitHub, navigate to the [repository](https://github.com/codeforboston/migrant_service_map). In the top-right corner of the page, click Fork.
2. On GitHub, navigate to your fork of the migrant_service_map repository. In the Clone with HTTPs section, click to copy the clone URL for the repository.
3. Clone your fork: In your terminal type `git clone`, paste the URL you copied and press enter. In your terminal/command prompt cd (change directory) into the new folder. Inside the directory:

```
git clone
https://github.com/YOUR-USERNAME/migrant_service_map.git
cd migrant_service_map
```

4. Add the migrant_service_map repository as a remote to your fork:

```
git remote add upstream
https://github.com/codeforboston/migrant_service_map.git
```

4. Installing: Checkout branch reboot and install

```
git checkout reboot
npm install
```

**Reboot** is the active development branch. Do not touch the `master` branch.

### Running the App

- In your terminal/command prompt run `npm start` to start the app. It will open automatically in a browser window.

- To stop the local server press ctrl + c in your terminal

### Updating

To learn more about keeping your fork up to date view this [article](https://help.github.com/articles/syncing-a-fork/),1. When there is an update, in your terminal inside your local repo:

```
git checkout reboot
git pull upstream
git pull upstream reboot
```

After running this command once, you may omit the `git pull upstream` step, and only enter `git pull upstream reboot`.

If there is a merge conflict that cannot be resolved automatically, the output from the `git pull` command will read: "Automatic merge has failed; fix conflicts and then commit the result." For more information, read this [article](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/).

**REMEMBER:** If there are no merge conflicts, or after resolving any conflicts, run the following in terminal:

```
npm install
```

## Testing

TODO

## Tech Stack

- [Reactjs](https://facebook.github.io/react/docs/react-api.html)
- [Mapbox](https://www.mapbox.com/)
- [Bootstrap](https://getbootstrap.com/)
