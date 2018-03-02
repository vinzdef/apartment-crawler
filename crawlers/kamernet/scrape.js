function scrapeListings() {

	var LISTINGS = []
	var rawListings = document.querySelectorAll('.room-tile')
		
	for (var li = 0; li < rawListings.length; ++li) {
		LISTINGS.push(scrapeListing(rawListings[li]))
	}

	return LISTINGS

	function scrapeListing(listing) {
		var listingModel = {
			author: listing.querySelector('.owner-name').textContent
		}

		listingModel.price = listing.querySelector('.rent').textContent
		listingModel.included = listing.querySelector('.rent + .subtitle').textContent.indexOf('G/W/E') >= 0

		listingModel.image = listing.querySelector('.room-pic img').src
		listingModel.link = listing.querySelector('.room-pic a').href
		listingModel.availability = listing.querySelector('.tile-block-2 .subtitle').textContent

		listingModel.content = listing.querySelector('.card-reveal p').textContent

		var date = new Date(Date.now())
		var rawDate = listing.querySelector('.owner-placement').textContent

		var days = rawDate.indexOf('days') >= 0
		var hours = rawDate.indexOf('hours') >= 0
		var weeks = rawDate.indexOf('weeks') >= 0

		var value = rawDate.match(/\d/)[0]

		if (days) {
			var currentHours = date.getHours() 
			date.setHours(currentHours - value)

		} else if (days) {
			var currentTime = date.getTime()
			date = new Date(currentTime - 1000 * 60 * 60 * 24 * value)

		} else if (weeks) {			
			var currentTime = date.getTime()
			date = new Date(currentTime - 1000 * 60 * 60 * 24 * 7 * value)
		}

		listingModel.created = date.getTime()

		return listingModel
	}
}

module.exports = scrapeListings