/*
 * main.js
 * Copyright (c) 2013 Baptiste Lepers
 * Released under MIT License
 */

var worldTheme = {
    animateContent:false,
    gmapsLoaded:false,
    lastJSON:null,
    lastShownJSON:null,

    changeThemeLang:function(l) {
    },

    showHeader:function(data) {
        $('#breadcrumbs').remove();
        $('#header').prepend('<ul id="breadcrumbs"><li><a href="#!">.</a></li></ul>');

        if(data) {
            var defaultURL = data.realurl?data.realurl:jGallery.currentPage;
            var dirUrl = jGalleryModel.pageToUrl(defaultURL).split('/');
            document.title = 'Photos :: '+((dirUrl=='')?'Index':dirUrl[dirUrl.length-2]);
            for(var i = 0; i < dirUrl.length - 1; i++) {
                var link = '';
                for(var j = 0; j <= i; j++) {
                    link += dirUrl[j]+((j==i)?'':'/');
                }
                $('#breadcrumbs').append('<li><a href="#!'+link+'">'+dirUrl[i]+'</a></li>');
            }
        }

        $('#search input').css('width', $('#header').width()-$('#breadcrumbs').width() - 90);
        $('#search').css('left', $('#breadcrumbs').width() + 30);

        $('#main_descr').remove();
        if(data && data.descr) {
            $('#content').append('<div id="main_descr" class="search">'+data.descr+'</div>');
        }
        $('#searchbox').focus();
        if($('#searchbox')[0] && $('#searchbox')[0].selectionStart)
            $('#searchbox')[0].selectionStart = $('#searchbox')[0].selectionEnd = ($('#searchbox')[0].value)?$('#searchbox')[0].value.length:0;
    },

    showError:function(data) {
        $("#errorTpl").tmpl(data).appendTo('#content');
    },

    createGmaps:function() {
       if($('.gps').length !== 0)
          return;

       $("#gpsTpl").tmpl().appendTo('#content');

       var options = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          scaleControl: true,
          mapTypeId: 'terrain',
          mapTypeControlOptions: {
             mapTypeIds: []/*[google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP]*/,
             style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
          },
       };
       var map = new google.maps.Map(document.getElementById("map_canvas"), options);

       var markers = [];
for (var i = 0; i < 100; i++) {
  var latLng = new google.maps.LatLng(data.photos[i].latitude,
      data.photos[i].longitude);
  var marker = new google.maps.Marker({'position': latLng});
  markers.push(marker);
}
var markerCluster = new MarkerClusterer(map, markers);
    },

    showGmaps:function(json) {
       worldTheme.createGmaps();
       worldTheme.lastShownJSON = json;
    },

    showContent:function(content, json) {
       if(json == worldTheme.lastShownJSON)
          return;

       worldTheme.lastJSON = json;
       if(!worldTheme.gmapsLoaded) 
          return;

       worldTheme.showGmaps(json);
    },
};

window.realShowWorldGPX = function(b) {
   if(b === true || worldTheme.gmapsLoaded)
      return;

   worldTheme.gmapsLoaded = true;
   if(worldTheme.lastJSON)
      worldTheme.showContent('whatever', worldTheme.lastJSON);
};

config.loadedThemes['world'] = worldTheme;
$script('http://maps.google.com/maps/api/js?sensor=false&callback=realShowWorldGPX', 'gmaps', window.realShowWorldGPX);

