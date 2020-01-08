  function initMap() {
    //Map options
    var opt = {lat: 49.234180, lng: 28.459883};
    var posVNTU = {lat: 49.234180, lng: 28.411367};
    var posHOME = {lat: 49.244658, lng: 28.538596};
    var icon_vntu = { 
      url: "marker_vntu.png", 
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0), 
      anchor: new google.maps.Point(20,40) 
    };

    var icon_home = { 
      url: "marker_home.png", 
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0), 
      anchor: new google.maps.Point(20,40) 
    };


    var options = {
      center: opt,
      zoom: 12
    }

    //new Map
    var myMap = new google.maps.Map(document.getElementById('map'), options);

    //new Markers
    var marketVNTU = new google.maps.Marker({
      position: posVNTU,
      map: myMap,
      title: "Це ВНТУ",
      icon: icon_vntu
    });


    var marketHome = new google.maps.Marker({
      position: posHOME,
      map: myMap,
      title: "Це мій дім",
      icon: icon_home
    });

    var info_home = new google.maps.InfoWindow({
      content: '<h3>Дім</h3><p>вул. Ватутіна <br> Район Тяжилів</p>'
    });

    var info_vntu = new google.maps.InfoWindow({
      content: '<h3>ВНТУ</h3><p><b>Факультет:</b> ФІКТІ<br><b>Курс:</b> 4 <br><b>Група:</b> 1КН-18мс <br><b>ПІП:</b> Грищук В.В.</p>'
    });

    //Click on marker
    google.maps.event.addListener(marketHome, 'click', function(event){
      info_home.open(myMap,marketHome);
    });

    google.maps.event.addListener(marketVNTU, 'click', function(event){
      info_vntu.open(myMap,marketVNTU);
    });

    //Click on map
    google.maps.event.addListener(myMap, 'click', function(event){
      
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=6023849ab6be8e21ba7901f823393410`)
    .then(function(res) {
      res.json().then(function(data) {
        let icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        removeMarkers();
        addMarker({
          coords: event.latLng,
          content: getContentMarker(data),
          icon: icon
        });
      });
    })
    .catch(function(error){
        console.log(error);
    });
  });

      var marker;
      var markers = [];

      function addMarker(props){
      
      var marker = new google.maps.Marker({
      position: props.coords,
      map: myMap,
      animation: google.maps.Animation.DROP,
      icon: props.icon
    })



    if(props.content){
      var infoWindow = new google.maps.InfoWindow({
        content: props.content
      });

      marker.addListener('click', function(){
        infoWindow.open(myMap, marker);
      });
    }

    markers.push(marker);
    map.panTo(props.coords);
    $('#latitude').val(marker.getPosition().lat());
    $('#longitude').val(marker.getPosition().lng());
  }

    function removeMarkers() 
{
  for (i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

    function getContentMarker(data){
    let temp = Math.floor(data.main.temp - 273);
    return `
      <ul class="content-list">
        <li class="content-list__item">City: <span>${data.name}</span></li>
        <li class="content-list__item">Country: <span>${data.sys.country}</span></li>
        <li class="content-list__item">Temperature: <span>${temp}grad/C</span></li>
        <li class="content-list__item">Wind: <span>${data.wind.speed}m/s</span></li>
        <li class="content-list__item">Coords: <span>${data.coord.lat}, ${data.coord.lon}</span></li>
      </ul>`;
  }
}
