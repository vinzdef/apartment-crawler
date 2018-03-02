var MD5 = require('./utils/md5.js')
var fs = require('fs')
var database = require('./posts.json')

function saveData(POSTS, done) {
	console.log('\n[SAVE DATA] PREPARING')

	POSTS.forEach(function (newPost) {
		var serializedPost = JSON.stringify(newPost)
		var postMD5 = MD5(newPost.link)
		database[postMD5] = serializedPost
	})

	console.log('[SAVE DATA] SAVING...')

	try {
		fs.write('./posts.json', JSON.stringify(database), 'w')
	} catch(e) {
		console.log(e)
	}

	setTimeout(function () {
		console.log('[SAVE DATA] SAVED!\n')
		done()
	}, 1000)
}

module.exports = saveData