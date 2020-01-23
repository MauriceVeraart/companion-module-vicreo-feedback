var instance_skel = require('../../instance_skel');
var actions       = require('./actions');

var debug;
var log;

class instance extends instance_skel {
    
    constructor(system,id,config) {
        super(system,id,config)

        Object.assign(this, {...actions})

        this.actions()
    }

    actions(system) {
        // ToDo
        this.setActions(this.getActions());
    }
    
    config_fields() {

		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module fetches info via a http request.'
			},
			{
                type: 'textinput',
                id: 'urltoget',
                label: 'url to fetch',
                default: '',
                width: 12
            },
            {
                type: 'textinput',
                id: 'vartoget',
                label: 'var to fetch',
                default: '',
                width: 12
            }
		]
    }

    action(action) {
		let id = action.action;
		let cmd;
		let opt = action.options;

		switch (id){
            case 'info':
                cmd = opt.url
                break
        }

        
        
    }
    
    getData() {
        if(this.config.urltoget !== "" && this.config.urltoget !== undefined) {
            
            let name = (this.config.vartoget !== undefined) ? this.config.vartoget : "MainClock"
            let cmd = this.config.urltoget

            try {
                this.timer = setInterval(() => {
                
                
                    this.system.emit('rest_get', cmd, (err, result) =>  {
                        if (err !== null) {
                            this.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
                            this.status(this.STATUS_ERROR, result.error.code);
                        }
                        else {
                            this.setVariable('dynamic1', result.data[name])
                        }
                    })
                } , 1000) // Every second
            }
            catch (error) {
                console.error('(timerstuff) Error cause is:', error);    
            }
        }
    }

    destroy() {

        
		if (this.timer) {
			clearInterval(this.timer);
			delete this.timer;
		}

		debug("destroy", this.id);
    }
    
    init() {
		debug = this.debug;
        log = this.log;
        var self = this

        this.init_variables()
        
        this.status(this.STATE_OK)
        this.getData()
 
    }
    
    updateConfig(config) {
    
        this.config = config;
    
        this.actions();
        if (this.timer) {
			clearInterval(this.timer);
			delete this.timer;
        }
        this.getData()
    }

    init_variables() {
    
        var variables = [
            { name: 'dynamic1', label: 'dynamic variable' },
            // { name: 'dynamic2', label: 'dynamic var2' },
        ]
    
        this.setVariableDefinitions(variables);
    
    }

}

exports = module.exports = instance;