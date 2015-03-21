exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "users"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, 
		{
			// extended functions and properties go here
			// it is a comma-seperated list of functions and properties
			/**
			 * log user in with username and password
			 * 
			 * @param {Object} _login
			 * @param {Object} _password
			 * @param {Object} _callback
			 */
			login: function(_login, _password, _callback)
			{
				var self = this;
				this.config.Cloud.Users.login(
					//remember, these curly-braced key-value pairs are JavaScript
					//object literals - they are usually what is sent as 
					//arguments to many methods in the API
					{
						login: _login,
						password: _password,
					}, function(e)
					{
						if(e.success){
							var user = e.users[0];
							
							//save session id
							Ti.App.Properties.setString('sessionId', e.meta.session_id);
							Ti.App.Properties.setString('user', JSON.stringify(user));
							
							//this syntax means: take the existing callback
							//and add the extra behavior/stuff
							_callback && _callback(
								{
									success : true,
									model: new model(user)
								}
							);
						} else {
							Ti.API.error(e);
							_callback && _callback(
								{
									success: false,
									model: null,
									error: e
								}
							);						
						}
					}
				);
			},

			createAccount: function(_ucerInfo, _callback)
			{
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				
				//if we detect bad data, return to caller
				if(!_userInfo)
				{
					_callback && _callback(
						{
							success: false,
							model: null
						}
					);
				} else {
					//we've got good user info
					cloud.Users.create(_userInfo, function(e){
						if(e.success)
						{
							var user = e.users[0];
							//set up persistent variables in the App's properties store
							TAP.setString("sessionId", e.meta.session_id);
							TAP.setString("user", JSON.stringify(user));
							
							//setting to allow ACS to track session id
							cloud.sessionId = e.meta.session_id;
							
							//callback with newly created user
							_callback && callback(
								{
									success: true,
									model: new model(user)
								}
							);
						} else {
							//no bueno
							Ti.API.error(e);
							__callback && _callback(
								{
									success: false,
									model: null,
									error: e
								}
							);
						}
					});
				}
			}			
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};