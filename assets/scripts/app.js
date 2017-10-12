var app = angular.module('appDist',[]);

app.controller('appDistController', function($scope, $http, $filter) {
    var releasesURL = "https://api.github.com/repos/sonect/app-dist/releases"

    var links = document.getElementsByTagName('a');
    var releases = [];

    for(var i = 0; i < links.length; i++) {
      var link = links[i];
      var title = link.parentNode.getElementsByClassName('card-title')[0];

      var platforms = releases[title.textContent] || [];

      if (link.href.indexOf("itms") != -1) {
        platforms['iOS'] = link;
      } else if (link.href.indexOf("apk") != -1) {
        platforms['Android'] = link;
      }

      releases[title.textContent] = platforms
    }

    if (Object.keys(releases).length) {
      $http.get(releasesURL).
      success(function(data, status, headers, config) {

        for(var i = 0; i < data.length; i++) {
          var release = data[i];

          var releasePlatforms  = releases[release.name];

          if (angular.isDefined(releasePlatforms)) {

            for(var j = 0; j < release.assets.length; j++) {
              var asset = release.assets[j];
              var releaseLink;

              if (asset.name.indexOf("ipa") != -1) { // iOS
                releaseLink = releasePlatforms["iOS"];
              } else if (asset.name.indexOf("apk") != -1) {
                releaseLink = releasePlatforms["Android"];
              }

              if (angular.isDefined(releaseLink)) {
                var ul = releaseLink.parentNode.getElementsByTagName('ul')[0];
                if (angular.isDefined(ul)) {
                  var li = document.createElement("li");
                  var date = $filter('date')(new Date(asset.updated_at),'dd MMM hh:mm a');
                  li.appendChild(document.createTextNode(asset.uploader["login"]+ " @ " + date ));
                  ul.appendChild(li);
                }
              }

            }
          }
        }

      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

})
