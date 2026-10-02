# SatelliteTrack

### About the project

An app for tracking satellites in active orbit around the globe, displaying them on a map of the Earth with the help of leaflet. You can choose which satellites are being tracked, with a total limit of 8 satellites being displayed on the map at once. Adding a satellite happens through the 'add satellite' interface on the left of the map and by inputting the given satellite's NORAD ID. There are three satellites being tracked by default and those are the ISS, Hubble and the Chinese space station (CSS). There is an information panel at the bottom containing curious details about each of those satellites, as well as about the project and developer.

### Tech stack

- **React 19**
- **Typescript**
- **Vite**
- **Vitest** + **React Testing Library**
- **Jest**
- **ESLint**
- **Axios**
- **Express.js**

### Getting started

You have to set up two terminals - one for the server and one for the front end. First, you need to set up the server, which lives in `server/`. Run the given commands there:

```
npm install
npm start
```

Once the server is running, continue with the front end, which lives in `front-end/`. Run the given commands there:

```
npm install
npm run dev
```

If all is correct, you should see the the information for the ISS, Hubble and CSS appear in the terminal for the server and then have it displayed on the map.

### Scripts

| Command              | Description                                           | Location           |
| -------------------- | ----------------------------------------------------- | ------------------ |
| `npm run dev`        | Start the Vite dev server                             | front-end          |
| `npm run build`      | Type-check (`tsc -b`) then produce a production build | front-end          |
| `npm run lint`       | Run ESLint over the project                           | front-end          |
| `npm run preview`    | Preview the production build locally                  | front-end          |
| `npm run test`       | Run the Vitest suite once (used before committing)    | front-end + server |
| `npm run test:watch` | Run Vitest in watch mode for local iteration          | front-end + server |
| `npm start`          | Starts the backend server                             | server             |

### Project structure

```
front-end/
├── img/                # Images used for the app (background, satellite icon)
├── src/
│   ├── components/     # Shared UI: AboutPanle, AddSatellitePanel, Button, CollapsableInfo, ...
│   ├── pages/          # The single page of the app: MapAndInfoControl
│   ├── requests/       # Requests for fetching and posting information on the server
│   ├── types/          # Typescript types used accross the front-end part of the app
│   ├── util_funcs/     # Functions used for calculations regarding position and path of satellites
├── tests/              # Tests for the front-end part of the app
server/
├── tests/              # Tests for the server part of the app
```
