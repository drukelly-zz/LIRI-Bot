const axios = require('axios')
require('colors')
require('dotenv').config()
const keys = require('./keys.js')
const moment = require('moment')
const Spotify = require('node-spotify-api')

let command = process.argv[2]
let value = process.argv[3]

switch (command) {
  case 'concert-this' :
    axios.get('')
    console.log('concert!')
    break
  case 'spotify-this-song' :
    let spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    })
    if (!value) value = 'Ace of Base - The Sign'
    spotify.search({
      type: 'track',
      query: value
    }).then(response => {
      let artists = response.tracks.items[0].artists[0].name
      let song = response.tracks.items[0].name
      let album = response.tracks.items[0].album.name
      let previewURL = response.tracks.items[0].external_urls['spotify']
      console.log(`Artist(s): ${artists}`.green)
      console.log(`Song: ${song}`.green)
      console.log(`Album(s): ${album}`.green)
      console.log(`Preview URL: ${previewURL}`.green)
    }).then(error => {
      if (error) console.log(error)
    })
    break
  case 'movie-this' :
    value = value.replace(/ /g, '+').toLowerCase()
    let queryURL = `https://www.omdbapi.com/?t=${value}&plot=short&apikey=${keys.omdb.apikey}`
    axios.get(queryURL)
      .then(response => {
        let convertedDate = moment(new Date(response.data.Released).toISOString())
        convertedDate = convertedDate.format('ll')
        console.log(`🎞  ${response.data.Title} 🎞`.yellow)
        console.log(`Release Date: ${convertedDate}`.yellow)
        console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`.yellow)
        console.log(`🍅 : ${response.data.Ratings[1].Value}`.yellow)
        console.log(`Country: ${response.data.Country}`.yellow)
        console.log(`Language: ${response.data.Language}`.yellow)
        console.log(`Plot: ${response.data.Plot}`.yellow)
        console.log(`🎭 : ${response.data.Actors}`.yellow)
      })
    break
  case 'do-what-it-says' :
    console.log('doing!')
    break
  default :
    console.log('Which command is that?')
    break
}
