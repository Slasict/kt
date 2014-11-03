(function() {
	var cheerio = require('cheerio');
	angular.module('app.factories')
		.factory('AnimesFactory', ['$http', 'ANNTransformer', '$filter', function($http, ANNTransformer, $filter) {

			var service   = {};
			var bulkUrl   = "http://cdn.animenewsnetwork.com/encyclopedia/reports.xml?id=172&nlist=6&nskip=";
			var singleUrl = "http://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=";
			var bgSearchUrl = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=xxlarge&imgtype=photo&safe=active&rsz=1&q=";
			var nyaaSearchUrl = "http://www.nyaa.se/?page=search&cats=1_37&sort=2&term=";
			var ytSearchUrl = "https://gdata.youtube.com/feeds/api/videos?orderby=relevance&max-results=1&v=2&alt=json&fields=entry(media:group(yt:videoid))&q=";
			var items     = [];
			var busy      = false;
			var _skip     = 0;

			function getItemById(id) {
				return $filter('filter')(items, {id: id})[0];
			};

			function toMB(sizeText) {
				// e.g 11 MB, 320 MB, 11 KB
				sizeText = sizeText.split(' ');
				var size = sizeText[0],
					unit = sizeText[1];
				
				if (unit === "KiB") size = size / 1024;
                if (unit === "GiB") size = size * 1024;
                if (unit === "MiB") size = size;
				return size;
			};

			service.nextPage = function() {
				console.log('nextpage');
				if (busy) return;
				busy = true;

				bulkUrl = bulkUrl + _skip;
				console.log('Request to ' + bulkUrl);
				$http.get(bulkUrl, {
					cache: true,
					transformResponse: ANNTransformer.bulk
				}).success(function(data, status, headers, config) {
					console.log('success');
					for (var i in data) {
						(function(i) {
							$http.get(singleUrl + data[i].id, {
								cache: true,
								transformResponse: ANNTransformer.single
							}).success(function(detailData) {
								data[i].detail = detailData;
								console.log('done');
								console.log(detailData);
							});
							items.push(data[i]);
						})(i);
					}
					_skip = items.length;
					busy = false;
					//$scope.animes = data;
					//$scope.$emit('EntryLoading');
				});
			}

			service.getItems = function() {
				return items;
			}

			service.isDetailForAnimePopulated = function(anId) {
				return getItemById(anId).detail;
			}

			service.setBackgroundImage = function(anId) {
				var animeItem = getItemById(anId);
				var anName = animeItem.name;
				$http.get(bgSearchUrl + anName)
					.success(function(imageSearchResult) {
						animeItem.detail.bgPicture = imageSearchResult.responseData.results[0].url;
					});
			}

			service.setTorrentUrl = function(anId) {
				console.log('setting torrent url');
				var animeItem = getItemById(anId);
				var anNameClean = animeItem.cleanName;
				var type = animeItem.detail.type;
				$http.get(nyaaSearchUrl + anNameClean)
					.success(function(nyaaSearchResult) {
						cheegii = cheerio.load(nyaaSearchResult);
						// iterate over each search result
						var list = cheegii('.tlist .tlistrow');
						for (var i = 0; i < list.length; i++) {
							var size = toMB(cheegii('.tlistsize', list[i]).text());
							if (type === 'TV' || type === 'OAV') {
								 if (size >= config.get('TorrentConf.tvEpisodeSizeMin')) {
								 	animeItem.detail.torrent = cheegii('.tlistdownload > a', list[i]).attr('href') + '&magnet=1';
								 	return false;
								 }
							} else {
								if (size >= config.get('TorrentConf.movieSizeMin')) {
								 	animeItem.detail.torrent = cheegii('.tlistdownload > a', list[i]).attr('href') + '&magnet=1';
									return false;
								}
							}
						}
					});
			}

			service.setYoutubeUrl = function(anId) {
				// Only set youtube video for movies or entry with no episode
				var animeItem = getItemById(anId);
				var anTrailerName = animeItem.cleanName + ' trailer';
				if (animeItem.detail.type === "movie" || animeItem.detail.episodes.length === 0) {
					$http.get(ytSearchUrl + anTrailerName)
						.success(function(ytSearchResult) {
							animeItem.detail.youtube = ytSearchResult.feed.entry[0].media$group.yt$videoid.$t;
						});
				}
			}

			return service;
		}]);
})();