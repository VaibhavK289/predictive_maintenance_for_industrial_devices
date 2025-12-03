# EPICS "Predictive Maintenance for Industry Devices" Project

This is the backend for the EPICS project.

~~We are using Node + ExpressJS for the backend. This will be used to call the APIs to apply the ML model to the data and add it to the database.~~
---
## Features and Working
- There are routes to fetch the sensor data from the postgres database.
- A route on /upload which checks for `sensor_data.csv` in the same directory as the server and adds any new entries to the database.

---
## Dev Notes

> Note - Ensure that you have set up your github ssh key in your system (ideally linux based) to be able to push to the repo. If not, refer to this resource - https://www.theodinproject.com/lessons/foundations-setting-up-git

> Make sure you have your `.env` file setup properly to ensure the connection with the postgreSQL server happens properly. Your postgreSQL needs to be active when making the connection as well.

### Set up
- Copy the SSH link from the github repository
- `git clone [SSH clone link]`
- Make sure the `.env` file is updated (since it is in .gitignore)
- Ensure all dependencies are there using `npm i`
- Run `npm run dev` to start the server (alternate - `node --watch index.js`)

### Contribution
- Fork the repository
- Clone the forked repo
- Make changes and push it to your forked repo
- Create pull request

