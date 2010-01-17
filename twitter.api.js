/*
 * Twitter API definition.
 * 
 * This script defines API objects to "Twitter.API".
 * A piece of API object means "API method" and It has properties listed below.
 * 
 *   name : API method name. (like 'statuses/public_timeline')
 *   description: Description of this method.
 *   url: Method URL. (The format(or id) has not been applied yet.)
 *   formats: Array of acceptable formats. ('xml', 'json', etc)
 *   method: HTTP method for this API method.
 *   auth: Requires Authentication or not.
 *   params: Available parameters.
 *   oparams: Additional OAuth parameters. (OAuth API only.)
 *   detectError: Function to validate parameters. If it detects error, returns error infomation object.
 * 
 * For API details, please refer to Twitter API Documentation. ( http://apiwiki.twitter.com/Twitter-API-Documentation )
 */
var Twitter;
if (typeof Twitter     == 'undefined') Twitter = {};
if (typeof Twitter.API == 'undefined') Twitter.API = {};

(function() {

var API = [
    //OAuth API
    {
        name: 'oauth/request_token',
        description: 'Allows a Consumer application to obtain an OAuth Request Token to request user authorization. ',
        url: 'http://twitter.com/oauth/request_token',
        method: 'GET',
        auth: true
    },
    {
        name: 'oauth/authorize',
        description: 'Allows a Consumer application to use an OAuth Request Token to request user authorization. ',
        url: 'http://twitter.com/oauth/authorize',
        method: 'GET',
        auth: true
    },
    {
        name: 'oauth/access_token',
        description: 'Allows a Consumer application to exchange the OAuth Request Token for an OAuth Access Token. ',
        url: 'http://twitter.com/oauth/access_token',
        method: 'POST',
        auth: true,
        oparams: {
            'oauth_verifier': null
        },
        detectError: function() {
            this.error = null;
            if (!this.oparams.oauth_verifier) {
                return this.error = { 'oauth_verifier': { 'type': 'required' } };
            }
        }
    },
    //Core API.
    {
        name: 'statuses/public_timeline',
        description: 'Returns the 20 most recent statuses from non-protected users who have set a custom user icon. ',
        url: 'http://twitter.com/statuses/public_timeline.format',
        formats: [ 'xml', 'json', 'rss', 'atom' ],
        method: 'GET',
        auth: false
    },
    {
        name: 'statuses/home_timeline',
        description: 'Returns the 20 most recent statuses, including retweets, posted by the authenticating user and that user\'s friends. ',
        url: 'http://api.twitter.com/1/statuses/home_timeline.format',
        formats: [ 'xml', 'json', 'atom' ],
        method: 'GET',
        auth: true,
        params: {
            'since_id': null,
            'max_id': null,
            'count': null,
            'page': null
        },
        detectError: function() {
            this.error = null;
            if (this.params.count && Number(this.params.count) > 200) {
                return this.error = { 'count': { 'type': 'limit over', 'value': 200 } };
            }
        }
    },
    {
        name: 'statuses/friends_timeline',
        description: 'Returns the 20 most recent statuses posted by the authenticating user and that user\'s friends. ',
        url: 'http://twitter.com/statuses/friends_timeline.format',
        formats: [ 'xml', 'json', 'rss', 'atom' ],
        method: 'GET',
        auth: true,
        params: {
            'since_id': null,
            'max_id': null,
            'count': null,
            'page': null
        },
        detectError: function() {
            this.error = null;
            if (this.params.count && Number(this.params.count) > 200) {
                return this.error = { 'count': { 'type': 'limit over', 'value': 200 } };
            }
        }
    },
    {
        name: 'statuses/user_timeline',
        description: 'Returns the 20 most recent statuses posted from the authenticating user. It\'s also possible to request another user\'s timeline via the id parameter. ',
        url: 'http://twitter.com/statuses/user_timeline.format',
        formats: [ 'xml', 'json', 'rss', 'atom' ],
        method: 'GET',
        auth: true, // if requesting a protected user's timeline.
        params: {
            'user_id': null,
            'screen_name': null,
            'since_id': null,
            'max_id': null,
            'count': null,
            'page': null
        }
    },
    {
        name: 'statuses/mentions',
        description: 'Returns the 20 most recent mentions (status containing @username) for the authenticating user. ',
        url: 'http://twitter.com/statuses/mentions.format',
        formats: [ 'xml', 'json', 'rss', 'atom' ],
        method: 'GET',
        auth: true,
        params: {
            'since_id': null,
            'max_id': null,
            'count': null,
            'page': null
        }
    },
    {
        name: 'statuses/show',
        description: 'Returns a single status, specified by the id parameter below. ',
        url: 'http://twitter.com/statuses/show/id.format',
        formats: [ 'xml', 'json' ],
        method: 'GET',
        auth: true,
        params: {
            'id': null
        },
        detectError: function() {
            this.error = null;
            if (!this.params.status) {
                return this.error = { 'id': { 'type': 'required' } };
            }
        }
    },
    {
        name: 'statuses/update',
        description: 'Updates the authenticating user\'s status. ',
        url: 'http://twitter.com/statuses/update.format',
        formats: [ 'xml', 'json' ],
        method: 'POST',
        auth: true,
        params: {
            'status': null,
            'in_reply_to_status_id': null,
            'lat': null,
            'long': null
        },
        detectError: function() {
            this.error = null;
            if (!this.params.status) {
                return this.error = { 'status': { 'type': 'required' } };
            }
            if (bover(this.params.status, 140)) {
                return this.error = { 'status': { 'type': 'limit over', 'value': 140 } };
            }
        }
    },
    {
        name: 'statuses/destroy',
        description: 'Destroys the status specified by the required ID parameter. ',
        url: 'http://twitter.com/statuses/destroy/id.format',
        formats: [ 'xml', 'json' ],
        method: 'DELETE',
        auth: true,
        params: {
            'id': null
        },
        detectError: function() {
            this.error = null;
            if (!this.params.status) {
                return this.error = { 'id': { 'type': 'required' } };
            }
        }
    },
    {
        name: 'account/verify_credentials',
        description: 'Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful; returns a 401 status code and an error message if not. ',
        url: 'http://twitter.com/account/verify_credentials.format',
        formats: [ 'xml', 'json' ],
        method: 'GET', // I want to change HEAD but API returns 401...
        auth: true
    },
    {
        name: 'account/rate_limit_status',
        description: 'Returns the remaining number of API requests available to the requesting user before the API limit is reached for the current hour. ',
        url: 'http://twitter.com/account/rate_limit_status.format',
        formats: [ 'xml', 'json' ],
        method: 'GET',
        auth: true // false for IP limit.
    }
];

for (var i = 0; i < API.length; i++) {
    var api = API[i];
    Twitter.API[api.name] = api;
}

//utils
function bover(str, len) {
    var b = 0;
    for(var i = 0, len = str.length; i < len; ++i) {
        ++b; if (str.charCodeAt(i) >= 128) ++b;
        if (b > len) return true;
    }
    return false;
}

})();
