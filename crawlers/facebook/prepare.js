function prepare(page, CFG, callback) {	
	var state = 'none'

	page.onLoadFinished = onStateChange
	page.open('https://m.facebook.com')
	
	function onStateChange() {		
		if (state === 'none') {
			var alreadyLogged = !(page.evaluate(loginAction, {email: CFG.email, pass: CFG.pass}))
			state = 'logged'
			
			if (alreadyLogged) {
				callback()
			}
		} else {
			callback()
		}
	}
}

function loginAction(fbConfig) {
	var form = document.querySelector('form.mobile-login-form')

	if (!form) {
		console.log('[-] Login form NOT found: assuming already logged')
		return false
	}

	console.log('[+] Login form found, filling...')
	var email = form.querySelector('input[name=email]')
	var pass = form.querySelector('input[name=pass]')


	email.value = fbConfig.email
	pass.value = fbConfig.pass
	console.log('[+] Login form filled, submitting...')

	form.submit()

	return true
}

module.exports = prepare