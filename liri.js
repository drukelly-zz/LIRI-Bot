const axios = require('axios')
require('colors')
require('dotenv').config()
const fs = require('fs')
const keys = require('./keys.js')
const moment = require('moment')
const Spotify = require('node-spotify-api')

let command = process.argv[2]
let value = process.argv[3]
let queryURL, output

// concert-this in a function
const concertThis = () => {
  // if no value is provided, BTS is the default
  if (!value) value = 'BTS'
  queryURL = `https://rest.bandsintown.com/artists/${value}/events?app_id=${keys.bandsInTown.app_id}`
  axios.get(queryURL)
    .then(response => {
      /* ------------------------------
      response is mapped to get the
      first indexed entry from data
      venue is an object. if we want
      the actual name, the key to
      get the value is 'name'
      ------------------------------ */
      let venue = response.data[0].venue['name']
      // datetime
      let datetime = response.data[0].datetime
      // converted datetime for the event date
      let convConcertDate = moment(new Date(datetime))
      convConcertDate = convConcertDate.format('MM/DD/YYYY')
      /* --------------------------------
      output signature for concert-this
      color coded magenta for events
      -------------------------------- */
      output = `🎫  ${value.toUpperCase()}\n🏟  ${venue}\n🗓  ${convConcertDate}\n`
      console.log(`\n${output}`.magenta)
      logToFile()
    })
    .then(error => {
      if (error) console.log(`${error}`.red)
    })
}

// do-what-it-says in a function
const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf-8', (error, data) => {
    if (error) console.log(`${error}`.red)
    // splits the data value into an array
    // comma being the delimiter
    let dataArr = data.split(',')
    // assign command to dataArr[0]
    command = dataArr[0]
    // assign value to dataArr[1] if it exist!
    if (dataArr[1]) value = dataArr[1]
    output = `${command},${value}\n`
    // no need to include logToFile because
    // the command indicated on random.txt will
    // determine the function to execute
    runCommand(command)
  })
}

// logToFile assumes the 'output' variable exist
const logToFile = () => {
  fs.appendFile('log.txt', `- ${command}\n${output}\n`, error => {
    error ? console.log(`${error}`.red) : console.log(`Content added to log.txt`.gray)
  })
}

// movie-this in a function
const movieThis = () => {
  // format value to replace spaces with +
  // also forces value to lowercase
  // probably not necessary but URL will look 'cleaner'
  if (!value) value = 'The Shining'
  value = value.replace(/ /g, '+').toLowerCase()
  queryURL = `https://www.omdbapi.com/?t=${value}&plot=short&apikey=${keys.omdb.apikey}`
  // query for the movie
  axios.get(queryURL)
    .then(response => {
      // convert ReleasedDate to standard ISO format
      let convReleasedDate = moment(new Date(response.data.Released).toISOString())
      // convert to a readable date format
      convReleasedDate = convReleasedDate.format('ll')
      /* -------------------------------------
      output signature for movie-this
      color coded yellow for movie-this
      ------------------------------------- */
      output = `🎞  ${response.data.Title} 🎞\nRelease Date: ${convReleasedDate}\nIMDB Rating: ${response.data.Ratings[0].Value}\n🍅 : ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\n🎭 : ${response.data.Actors}\n`
      console.log(`\n${output}`.yellow)
      logToFile()
    })
    .then(error => {
      if (error) console.log(`${error}`.red)
    })
}

// spotify-this in a function
const spotifyThis = () => {
  // node-spotify-api id and secret
  let spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  })
  // if no value is provided, 'Ace of Base' is the default
  if (!value) value = 'Ace of Base - The Sign'
  // spotify query search
  spotify.search({
    type: 'track',
    query: value
  }).then(response => {
    // map response values to proper variables
    let artists = response.tracks.items[0].artists[0].name
    let song = response.tracks.items[0].name
    let album = response.tracks.items[0].album.name
    let previewURL = response.tracks.items[0].external_urls['spotify']
    /* -------------------------------------
    output signature for spotify-this-song
    color coded green for spotify
    ------------------------------------- */
    output = `Artist(s): ${artists}\nSong: ${song}\nAlbum(s): ${album}\nPreview URL: ${previewURL}\n`
    console.log(`\n${output}`.green)
    logToFile()
  }).then(error => {
    if (error) console.log(`${error}`.red)
  })
}

// runCommand function declaration
// takes an argument of 'command'
const runCommand = command => {
  // switch conditional structure for all the possible commands
  switch (command) {
    case 'concert-this' :
      concertThis()
      break
    case 'spotify-this-song' :
      spotifyThis()
      break
    case 'movie-this' :
      movieThis()
      break
    case 'do-what-it-says' :
      doWhatItSays()
      break
    // defaults to an error message when it doesn't map to a specific command
    default :
      output = '\n🤔️  Which command is that? ⁉️\n'
      console.log(output)
      logToFile()
      break
  }
}

// execute the runCommand function
runCommand(command)
