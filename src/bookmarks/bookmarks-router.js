const express = require('express')
const uuid = require('uuid')
const logger = require('../logger')
const { isWebUri } = require('valid-url')
const store = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(store.bookmarks);
    })
    .post(bodyParser, (req, res) => {
       for (let field of ['title', 'url', 'rating']) {
           if (!req.body[field]) {
               logger.error(`The ${field} field is required`)
               return res
                .status(400)
                .send(`The ${field} field is required`)
           }
       }
       const { title, url, description, rating} = req.body

       if (!isWebUri(url)) {
           logger.error(`The url must be a valid url beginning with 'https://`)
           return res
            .status(400)
            .send(`The url must be a valid url beginning with 'https://www.`)
       }

       if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
           logger.error(`The ${rating} supplied is not valid`)
           return res
            .status(400)
            .send(`The rating for each bookmark must be a number between 0 and 5`)
       }

       const newBookmark = {
           id: uuid.v4(),
           title,
           url,
           description,
           rating
       }

       store.bookmarks.push(newBookmark)

       logger.info(`New bookmark created with ID ${newBookmark.id}`)
       return res
        .status(201)
        .location(`https://localhost:8000/bookmarks.${newBookmark.id}`)
        .json(newBookmark)

    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params
    
        const bookmark = store.bookmarks.find(item => item.id === id)

        if (!bookmark) {
            logger.error(`No bookmark found with the id ${id}`)
            return res
                .status(404)
                .send('Bookmark not found in database')
        }

        logger.info(`Bookmark with id ${id} found in databse`)
        res
            .status(200)
            .json(bookmark)
        
        })
    .delete((req, res) => {
        const { id } = req.params

        const bookmarkIndex = store.bookmarks.findIndex(item => item.id === id)
        const deleteBookmark = store.bookmarks.find(item => item.id === id)

        if (!deleteBookmark) {
            logger.error(`No bookmark found with the id ${id}`)
            return res
                .status(404)
                .send('Bookmark not found in database')
        }

        store.bookmarks.splice(bookmarkIndex, 1)
        
        logger.info('Bookmark deleted from database')
        res
            .status(200)
            .send('Bookmark deleted')
    })

module.exports = bookmarksRouter