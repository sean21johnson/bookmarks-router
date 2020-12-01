const uuid = require('uuid')

const bookmarks = [
    {   id: uuid.v4(),
        title: 'Thinkful',
        url: 'https://www.thinkful.com',
        description: "Great bootcamp website",
        rating: 4
    },
    {   id: uuid.v4(),
        title: 'NBA',
        url: 'https://www.nba.com',
        description: "Great basketball website",
        rating: 3
    }
]

module.exports = { bookmarks }