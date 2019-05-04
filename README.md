# LIRI Bot
**Language Interpretation Recognition Interface**
A Node.js command line app. Think "Siri/Google/Alexa" for the command line.

# Node Packages Used
- axios [https://www.npmjs.com/package/axios]
For handling requests for `concert-this` and `movie-this`
- colors [https://www.npmjs.com/package/colors]
Add color to `console.log()` messages
- dotenv [https://www.npmjs.com/package/dotenv]
For handling API Keys/Tokens
- fs [https://www.npmjs.com/package/file-system]
File system: writing and reading to files
- moment [https://www.npmjs.com/package/moment]
Format datetime objects
- node-spotify-api [https://www.npmjs.com/package/node-spotify-api]
Spotify API

# Install
A `package.json` is included  with the necessary dependencies. Clone/download the project and run `npm install`. Rename `.env-sample` to `.env` and input the API IDs/secret/keys to run this project successfully.

## Available Commands
- `concert-this '<Artist Name>'` A lookup command for Bands In Town API. A default value is in place if an artist name or a query string isn't provided.
- `movie-this '<Movie Name>'` A lookup command for OMDB API. A default value is in place if a movie name or query string isn't provided.
- `spotify-this-song '<Artist> || <Song Title> || <Text Query>'` A lookup command for Spotify. A default artist/song is in place if a value isn't provided.
- `do-what-it-says` References a text file: `random.txt`. This command can run any of the three commands listed above. For example, command/value structure is delimited by a comma, e.g. `movie-this,"Avengers Endgame"`

### Bug
`concert-this` command yields an error output sporadically when placed inside the `random.txt` file. It can also produce an error when `do-what-it-says` doesn't 'like' the value associated with the command. 😖