function scrapeAction() {

	var CHECK_FIELDS = ['price', 'content']
	var FILTERS = {
		'content': [
		
			function (c) {
				if (c.contains('for sale')) return true
			},

			function (c) {
				if (
					c.match(/for (a )?lady/) || 
					c.match(/for (a )?female/) ||
					c.match(/(lad(y|ies)|female) only/) ||
					c.match(/only( for( a)?)? (lad(y|ies)|female(s)?)/)  
				) return true
			},

			function () {

			}
		],

		'price': [
			function (p) {
				if (p > 750) return true
			}
		]
	}

	window.scrollTo(0, document.body.scrollHeight)

	var POSTS = []
	var rawPosts = document.querySelectorAll('section > article')

	for (var pi = 0; pi < rawPosts.length; ++pi) {
		var post = scrapePost(rawPosts[pi])
		if (post) {
			POSTS.push(post)
		}
	}

	return POSTS
	
	function checkFilters(data, kind) {		
		var positive = FILTERS[kind].reduce(function (prev, filter) {
			return filter(data)
		}, false)

		return positive
	}

	function checkPostModel(post) {
		return CHECK_FIELDS.reduce(function (prev, key) {
			
			if (post[key]) {
				var positive = checkFilters(post[key], key)
				
				if (positive) {
					console.log('FILTERED! ', 'because of', key, post[key])
				}

				return positive
			}

			return false
		}, false)
	}

	function scrapePost(post) {

		var postModel = {
			author: {
				name: post.querySelector('header h3').textContent,
				link: post.querySelector('header h3 a').href
			}
		}

		var fbDate = post.querySelector('header [data-sigil=m-feed-voice-subtitle] a').textContent
		
		var date = new Date(Date.now())
		var pieces = fbDate.split(' ')
		
		if (pieces.length <= 3) {
			var hoursAgo = pieces[0]
			var hoursNow = date.getHours()

			date.setHours(hoursNow - hoursAgo)
		} else {
			date.setDate(pieces[0])
			date.setMonth(['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'].indexOf(pieces[1]))

			var time = pieces[4].split(':')
			date.setHours(time[0])
			date.setMinutes(time[1])
		}

		postModel.created = date.getTime()

		postModel.link = post.querySelector('header [data-sigil=m-feed-voice-subtitle] a').href
		
		var price = post.querySelector('._4guw') && post.querySelector('._4guw').textContent
		postModel.price = price && price.match(/\d+/) ? parseInt(price.match(/\d+/)[0]) : null
		
		postModel.content = post.querySelector('[class^=_5r] ._il') && post.querySelector('[class^=_5r] ._il').textContent

		if (post.querySelector('._4gus span:last-child')) {
			postModel.title = post.querySelector('._4gus span:last-child').textContent
		}

		if (post.querySelector('[class^=_5r] a[href^="/photos/viewer"] .img')) {
			postModel.image = post.querySelector('[class^=_5r] a[href^="/photos/viewer"] .img').style.backgroundImage.match(/url.(.*)./)[1].replace(/\"/g, '')
		}

		if (!checkPostModel(postModel)) {
			return null
		}

		return postModel
	}	
}

module.exports = scrapeAction