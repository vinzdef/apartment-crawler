var saveData = require('./save-data.js')
var Crawler = require('./base-crawler.js')

var CONFIGS = [
	require('./crawlers/facebook'),
	require('./crawlers/kamernet')
]

var workers = CONFIGS.map(function (CFG, index) {
	return new Crawler(CFG, onScrapingDone)
})

console.log('[MAIN] Active Crawlers: ', CONFIGS.map(function (C) {return '\n - ' + C.name}))
workers[0].start()
var currentWorker = 0

function onScrapingDone(crawledData) {
	saveData(crawledData, function () {			
		if (currentWorker < workers.length -1) {
			++currentWorker
			workers[currentWorker].start()
		} else {
			console.log('[MAIN] --- DONE')
			phantom.exit()
		}
	})
}