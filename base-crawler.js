var webpage = require('webpage')

var BaseCrawler = function (CFG, onScrapingDone) {

	this.page = webpage.create()

	this.POSTS = []
	this.CFG = CFG

	this.URLS = typeof CFG['url'] === 'object' ? CFG['url'] : [CFG['url']]

	if (CFG.cookies) {
		this.CFG.cookies.forEach(phantom.addCookie)
	}
	this.onStateChange = this.onStateChange.bind(this)

	this.page.onLoadFinished = function (status) {
		this.onStateChange(status)
	}.bind(this)

	this.page.onConsoleMessage = this.onMessage.bind(this)
	this.onScrapingDone = onScrapingDone.bind(this)

	this.state = 'ready'
}

BaseCrawler.prototype = {
	start: function start() {
		console.log('\n[+] --- Starting ' + this.CFG.name + ' Crawler\n')

		if (this.CFG.prepare) {
			console.log('['+ this.CFG.tagName +'] - PREPARE PHASE')

			this.CFG.prepare(this.page, this.CFG, function () {
				console.log('['+ this.CFG.tagName +'] Prepare done.', '\n')
				
				this.page.onLoadFinished = function (status) {
					this.onStateChange(status)
				}.bind(this)
				
				this.page.open(this.URLS.pop())
			}.bind(this))
		} else {
			this.page.open(this.URLS.pop())
		}
	},

	onStateChange: function onStateChange(status) {
		console.log('[' + this.CFG.tagName + '] (STATE CHANGE) - Status: ', status, '    State:', this.state, '\n')

		switch (this.state) {
			case 'ready': 
				this.scrapeCurrentPage();
				break;
			case 'done-scraping':
				if (this.URLS.length > 0) {
					console.log('['+ this.tagName +'] --- Scraping next page', '\n')
					this.state = 'ready'
					this.page.open(this.URLS.pop())
				} else {
					this.saveAndExit()
				}
				break;
			default: console.log('!!!UNHANDLED STATE!!! ', this.state)
		}
	},

	scrapeCurrentPage: function scrapeCurrentPage() {
		console.log('\n['+ this.CFG.tagName +'] - SCRAPE PHASE')
		this.page.render('./screens/'+ this.CFG.name +'/page.png')

		this.POSTS = this.page.evaluate(this.CFG.action)
		console.log('[' + this.CFG.tagName + '] Scraping FINISHED...', '\n')

		this.state = 'done-scraping'
		this.onStateChange()
	},

	saveAndExit: function saveAndExit() {
		this.POSTS.forEach(function(post) {
			post.source = this.CFG.name
		}.bind(this))
		
		console.log('[' + this.CFG.tagName + '] DONE')
		this.onScrapingDone && this.onScrapingDone(this.POSTS)
	},

	onMessage: function onMessage(msg) {
		console.log('[' + this.CFG.tagName + '] (REMOTE LOG) -', msg)
	}
}

module.exports = BaseCrawler