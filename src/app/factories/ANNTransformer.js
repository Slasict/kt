(function() {
	var xml2js = require('xml2js').Parser({attrkey: "$$"});
	angular.module('app.factories')
		.factory('ANNTransformer', function($filter) {
			function generateCleanName(name) {
				var cleanName = "";
				var split = /(.*)\s\([^)]*\)/.exec(name);
		        if (split && split.length === 2) {
		            cleanName = split[1].trim();
		        }
		        return cleanName;
			}

			return {
				bulk: function(data) {
					var jsData = [];
					xml2js.parseString(data, function(err, result) {
						result.report.item.forEach(function(item) {
							jsData.push({
								id: item.$$.id,
								name: item.anime[0]._,
								cleanName: generateCleanName(item.anime[0]._),
								rating: parseFloat(item.bayesian_average[0]).toFixed(1),
								detail: false
							});
						});
					});
					return jsData;
				},
				single: function(data) {
					var jsData = {};
					xml2js.parseString(data, function(err, result) {
						if (!result.ann.anime[0]) return;
						result = result.ann.anime[0];
						jsData.id = result.$$.id;
						jsData.type = result.$$.type;
						jsData.runtime = $filter('filter')(result.info, {$$: {type: 'Running time'}})[0]._;
						jsData.summary = $filter('filter')(result.info, {$$: {type: 'Plot Summary'}})[0]._;
						jsData.picture = $filter('filter')(result.info, {$$: {type: 'Picture'}});
						jsData.picture = jsData.picture[jsData.picture.length - 1].img;
						jsData.picture = jsData.picture[jsData.picture.length - 1].$$.src;
						jsData.vintage = {};
						jsData.genres = [];
						jsData.episodes = [];
						jsData.bgPicture = ''; // TODO: set defaut bg picture
						jsData.torrent = '';

						// air start end dates
						var vintages = $filter('filter')(result.info, {$$: {type: 'Vintage'}});
						// if has more than 1 vintage date try to parse according to type
						if (vintages.length > 1) {
							// if not TV or OAV
							if (["TV", "OAV"].indexOf(jsData.type) == -1) {
								jsData.vintage = { "start": vintages[0]._, "end": vintages[0]._ };
							} else {
								for (var i in vintages) {
									var reg = /(.*)\sto\s(.*)/.exec(vintages[i]._);
									if (reg) {
										jsData.vintage = { "start": reg[1], "end": reg[2] };
										break;
									}
								}
							}
						} else {
							var reg = /(.*)\sto\s(.*)/.exec(vintages[0]._);
							if (reg) {
								jsData.vintage = { "start": reg[1], "end": reg[2] };
							} else {
								jsData.vintage = { "start": vintages[0]._, "end": vintages[0]._ };
							}
						}

						var genres = $filter('filter')(result.info, {$$: {type: 'Genres'}});
						if (genres.length > 0) {
							for (var i in genres) {
								jsData.genres.push(genres[i]._)
							}
						}

						var episodes = result.episode;
						if (typeof episodes != 'undefined' && episodes.length > 0) {
							var episodesArray = [];
							for (var i in episodes) {
								if (episodes[i].$$.num != "") {
									jsData.episodes.push({
										episodeNumber : episodes[i].$$.num,
										episodeTitle  : episodes[i].title[0]._
									});
								}
							}
						}

					});
					return jsData;
				}
			};
		});
})();