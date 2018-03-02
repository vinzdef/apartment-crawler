var CFG = {
	url: [
		"https://m.facebook.com/groups/amsterdam.apartments/",
		"https://m.facebook.com/groups/564979830256051",
		"https://m.facebook.com/groups/702616376420205",
		"https://m.facebook.com/groups/143224392751384"
	],
	action: require('./scrape.js'),
	prepare: require('./prepare.js'),

	email: '<FB_EMAIL>',
	pass: '<FB_PASS>',

	name: 'facebook',
	tagName: 'FB'
}

module.exports = CFG
