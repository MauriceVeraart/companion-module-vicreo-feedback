module.exports = {

	getActions() {
		var actions = {}
        actions['info'] = { 
            label: 'module only for feedback/variable',
            options: [{
                label: 'url to get',
                type: 'textinput',
                id: 'url',
                default: 'hello'
            }]
        }

        return actions
    }
}