var htUrl = 'hubtraffic.com';

var htEmbedTrack = htEmbedTrack || (function(){
    var htUrl;
	var site_id;
	var referrer;
	var page;
	var isSend = false;

	var getSiteID = function() {
		var requestURL = document.getElementById("htScript").getAttribute("src");
		if(requestURL) {
			var queryString = requestURL.substring(requestURL.indexOf("?") + 1, requestURL.length);
		} else {
			return -1;
		}
		var params = queryString.split("&");
		site_id = -1;
		for(var i = 0; i < params.length; i++){
			var name  = params[i].substring(0,params[i].indexOf("="));
			var value = params[i].substring(params[i].indexOf("=") + 1, params[i].length);
			if(name == 'site_id') {
				site_id = parseInt(value);
				break;

			}
		}
		return site_id;
	}

	var getPageName = function (url) {
		var domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
		return domain;
	};
	var process = function() {
		if (checkReferrer()) {
			createTrackingScript();
		}
	}

    var setScriptDomain = function() {
        var matches = document.getElementById("htScript").getAttribute("src").match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        var domain = matches && matches[1];
		htUrl = domain;
		if(htUrl.search('hubxt.') == 0) {
			htUrl = htUrl.replace('hubxt.', 'ht.');
		}
    }

	var createTrackingScript = function() {
        setScriptDomain();
		if (isSend) return;
		(function() {
			isSend = true;
			var rta = document.createElement('script');
			rta.type = 'text/javascript';
			rta.async = true;
			var timestamp = new Date().getTime();
			rta.src = ('https:' == document.location.protocol ? 'https://' : 'http://')
				+ htUrl
				+ '/htjs.php?i=' + site_id + '&r='+encodeURIComponent(document.referrer)
				+ '&e=1'
				+ '&cache=' + timestamp;
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(rta, s);
		})();

	}

	var checkForSearchEngine = function(ref) {
		var pcol = ref.indexOf("://") + 3;

		return ref.indexOf("google.") == pcol || ref.indexOf("www.google.") == pcol;

	}

	var checkReferrer = function() {
		page = getPageName(window.location.href);
		referrer = getPageName(document.referrer);
		if(referrer != '' && referrer != page && checkForSearchEngine(document.referrer) == false) return true;
		return false;
	}

	return {
		track : function() {
			getSiteID();
			if(site_id > 0) {
				process();
			}
		}
	};
}());
