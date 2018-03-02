var CFG = {	
	url: 'https://kamernet.nl/huren/kamers-amsterdam',
	action: require('./scrape.js'),
	name: 'kamernet',
	tagName: 'KA',

	cookies: [{
		name: 'CURRENT_LANGUAGE_ID',
		value: '2',
		domain: '.kamernet.nl'
	}]
}

module.exports = CFG