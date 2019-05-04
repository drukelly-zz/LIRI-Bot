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

// switch conditional structure for all the possible commands
// defaults to an error message when it doesn't map to a specific command
switch (command) {
  case 'concert-this' :
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
        fs.appendFile('log.txt', `- ${command}\n${output}\n`, error => {
          error ? console.log(error.red) : console.log(`Content added to log.txt`.gray)
        })
      })
      .then(error => {
        if (error) console.log(error.red)
      })
    break
  case 'spotify-this-song' :
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
      fs.appendFile('log.txt', `- ${command}\n${output}\n`, error => {
        error ? console.log(error.red) : console.log(`Content added to log.txt`.gray)
      })
    }).then(error => {
      if (error) console.log(error.red)
    })
    break
  case 'movie-this' :
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
        output = `🎞  ${response.data.Title}  🎞\nRelease Date: ${convReleasedDate}\nIMDB Rating: ${response.data.Ratings[0].Value}\n🍅 : ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\n🎭 : ${response.data.Actors}\n`
        console.log(`\n${output}`.yellow)
        fs.appendFile('log.txt', `- ${command}\n${output}\n`, error => {
          error ? console.log(error.red) : console.log(`Content added to log.txt`.gray)
        })
      })
      .then(error => {
        if (error) console.log(error.red)
      })
    break
  case 'do-what-it-says' :
    console.log('doing!')
    break
  default :
    console.log('\n🤔️  Which command is that? ⁉️')
    break
}
