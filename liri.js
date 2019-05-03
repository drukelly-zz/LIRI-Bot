const axios = require('axios')
require('colors')
require('dotenv').config()
const moment = require('moment')
const nodeSpotify = require('node-spotify-api')
const keys = require('./keys.js')

let command = process.argv[2]
let value = process.argv[3]

switch (command) {
  case 'concert-this' :
    axios.get('')
    console.log('concert!')
    break
  case 'spotify-this-song' :
    console.log('spotify!')
    break
  case 'movie-this' :
    // value = value.replace(' ','+').toLowerCase()
    let queryURL = `https://www.omdbapi.com/?t=${value}&plot=short&apikey=${keys.omdb.apikey}`
    axios.get(queryURL)
      .then(response => {
        console.log(`🎞  ${response.data.Title} 🎞`.yellow)
        console.log(`Release Date: ${response.data.Released}`.yellow)
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
