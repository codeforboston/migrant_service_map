# Migrant Service Map

### Migrant Service Map-MSM Project

(start date 9.13.18)

### by [Refugees Welcome](https://refugeeswelcomehome.org/)!

### [Live Demo](https://migrantservicemap.com)

 The Migrant Service Map is an application which allows service providers to more effectively network with one another in order to provide the best recommendations to their clients. 

### Partners: MapBox and Code for Boston

Thanks for choosing to support our initiative to support and strengthen migrant service provision in the greater Boston area. For more information about our organization, visit [Refugees Welcome](https://refugeeswelcomehome.org/).

### Project Founder:

- Charla M. Burnett ([Refugees Welcome](https://refugeeswelcomehome.org/)) charla.burnett89@gmail.com

### MapBox Support:

- Marena Brinkhurst marena.brinkhurst@mapbox.com
- Sam Fader sam.fader@mapbox.com
- Mall Wood mal.wood@mapbox.com
- Joe Clark joe.clark@mapbox.com

### Code for Boston Support:

- Liam Morley liam@codeforboston.org
- Matt Zagaja mattz@codeforboston.org

## Project Materials and Communications

- Slack Channel: #migrantservicemap
  - [Join Code for Boston's Slack Workplace](https://communityinviter.com/apps/cfb-public/code-for-boston)
- [Project Board](https://trello.com/invite/b/rVNLIxod/2c7ced88a95f6514f8ef49eb2e622cd8/migrant-service-map)
- [Design Google Drive](https://drive.google.com/drive/folders/12cSCKSf9IQT1nMJUomWFQNyG2PLCsmOw)
- [Database](https://docs.google.com/spreadsheets/d/e/2PACX-1vT4MST1klxwmBdfvMhOycfV5C-lxGe0_sidJnmGS8U42irBYhgazisd-OUjrI4V9l_GqnazklGhNjzJ/pub)
- [Planning Documentation](https://drive.google.com/drive/folders/1VnylhChsStemQu7hPk4bITtXmPQ1IAoY)

## Summary

The Migrant Service Map (MSM) was conceptualized as a part of Refugees Welcome!'s ongoing research on streamlining migrant services in Boston. The objective of the map is to act as a spatial guide for migrants and service providers to find specific types of services closest to them and their clients. The database includes a comprehensive list of all service providers and the services they offer. The data on service providers in Boston has already been collected by Refugees Welcome! and is geocoded.

## Ideal Product Vision
 
The migrant or service provider is able to click on the MSM link and be transferred to a questionnaire page where they would be asked whether they are service providers or migrants. The next page would ask the service provider if they have become a part of the Refugees Welcome! network and offer a separate link to apply to the RW! Network. This page would also ask what the legal status is of their client, the address of the client, and what types of services they are looking for. The legal status is important because undocumented and asylum seekers cannot receive all public services. None of this data would be collected or stored due to security concerns.

The types of services include housing, work placement, english, legal assistance, registration, health, mental health, community centers, and education. The map would conduct a spatial analysis to highlight each service provider within .5, 1, 3, and 5 miles of the address entered for whichever legal status and service applies to their search. The migrant or service provider will be able to click on the service provider points and is provided with a comprehensive overview of the services provided and contact information. This tool will be used by service providers and migrants to find and plan the integration of new arrivals to Boston. As a result, it would be helpful if the platform could keep a record of each point of interest that then could be easily printed. That way service providers can give clients an easy list of service providers to contact upon arrival.

## Phase One (The Product as of the December 2019 Refugees Welcome! Resource Forum)

Phase one of the Migrant Service Map is geared primarily toward service providers. When they arrive on the site, the service provider is able to select the type of provider(s) that they are looking for, specify a location to search near (such as their client's home or workplace), and choose a distance from that location (.5, 1, 3 and 5 miles) by which to filter their results by. 

The categories of providers which are currently included in the map are: Cash/Food Assistance, Community Center, Education, Health, Housing, Job Placement, Legal, Mental Health, and Resettlement. According to the other selections which the user makes (ie a location and/or proximity to it), a list of providers which meet those criteria populates the map and the "Saved Providers" tab. By selecting either entries in the map or from the list in the "Saved Providers" tab, users can see more details about organizations such as their mission statement, location, and contact information. Users can also sort the "Saved Providers" list to make it easier for them to find providers. 

Once a user has found organizations which they would like to recommend to a client, they may choose to save them, populating their "Saved" tab. In this tab, the user may reorder organizations manually to provide a list which is most logical to their client, then share this list via email or print it out.  

Service providers are also able to update their data or add themselves to the organizations included in the map. There is a form which allows users to provide feedback on the tool as well as complete help documentation.

## Next Steps

The next step in this process is soliciting user feedback about the tool. This is essential because the Migrant Service Map did not have substantial user feedback throughout its design or development stages. Getting feedback and input from service providers who are using the phase one of this product should primarily inform design decisions moving forward. 

With that said, however, some features were intended for future phases in the original product vision. Those include making the tool accesible for migrants (ie by making it mobile friendly and translating it), creating profiles for providers so that they may save lists or preferences across sessions or clients, and expanding to providers beyond the Boston area. For a complete list of features which were identified for future phases, visit https://refugeeswelcomehome.org/migmap-services/.


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
git clone \
https://github.com/YOUR-USERNAME/migrant_service_map.git
cd migrant_service_map
```

4. Add the migrant_service_map repository as a remote to your fork:

```
git remote add upstream \
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

Run unit tests with `npm start`. Tests will automatically re-run as you update files.

We use [Travis CI](https://docs.travis-ci.com/) for continuous integration and deployment. When a commit is added to a branch or a PR, travis runs tests, builds the app, and reports results in the PR conversation. Travis is configured in `.travis.yml` and builds are viewable in the [Travis dashboard](https://travis-ci.org/codeforboston/migrant_service_map). Travis should pass before merging PR's.

We use [Cypress](https://www.cypress.io) for functional (e2e) testing. Cypress test results from Travis branch builds are viewable in the [Cypress dashboard](https://dashboard.cypress.io/projects/wxgyq3/runs).

Running the Cypress test suite requires that a local version of the site is available at [http://localhost:3000/]. This can be done with the command `npm start`. Then in a separate terminal, run the following to open the Cypress interface:

```
$(npm bin)/cypress open
```

All tests can be run by clicking `Run all specs` in the top-right of the application window.

You can run Cypress tests from the command line using `npm run test:cy` against a running server, or `npm run test:cy-start-server` to start a server, run tests, and then shut everything down.

## Deployment

We use [Firebase](https://firebase.google.com/docs/hosting) to host the app at [migrant-service-map.web.app](https://migrant-service-map.web.app) and [migrant-service-map.firebaseapp.com](https://migrant-service-map.firebaseapp.com). Firebase is configured using `.firebaserc`, `firebase.json`, and the [migrant-service-map](https://console.firebase.google.com/project/migrant-service-map/hosting/main) project page. We use the free [Spark](https://firebase.google.com/pricing) plan, which should be more than enough for development, testing, and demos. If we go over the monthly limits, the site is disabled until the next month (or we upgrade to a paid plan).

We use Travis to automate the deployment process. Whenever the `prod` (production) branch is updated, Travis builds the app as for any other commit. Then, if the build succeeds, it uploads the site to Firebase using the token stored in `.travis.yml`. The token is set up using [these instructions](https://docs.travis-ci.com/user/deployment/firebase/#generating-your-firebase-token).

## Tech Stack

- [Reactjs](https://facebook.github.io/react/docs/react-api.html)
- [Mapbox](https://www.mapbox.com/)
- [Bootstrap](https://getbootstrap.com/)
