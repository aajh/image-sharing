# image-sharing

![Screenshot](https://www.dropbox.com/s/m8rtjydzdls32w1/Screenshot.png?raw=1)

### Usage

First install [db-migrate](https://www.npmjs.com/package/db-migrate) and [grunt-cli](http://gruntjs.com) for node:

    npm install -g db-migrate grunt-cli

Then go to the project root and run:

    npm install
    db-migrate up:all
    grunt

These commands will
* install all needed npm packages
* run db migrations and populate it with test data
* generate .js and .css files and start the server at [http://localhost:3000](http://localhost:3000)
