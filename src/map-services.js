
export function getResourceObject(map){
  var services = map.querySourceFeatures('composite', {sourceLayer: 'refugees-services'});
  var resourceObject = {};
    for (var i = 0; i < services.length; i++) {
      var type = services[i].properties.type; 
      if ( ! Object.keys(resourceObject).includes(type) ) {
        resourceObject[type] = []; 
      }

      var resource = services[i].properties; 
      resource.coordinates = services[i].geometry.coordinates; 
      resource.lngLat = services[i].lngLat; 
      resourceObject[type].push(resource); 

    }
  return resourceObject; 
}

export function makeResourceEntry(map, mapboxgl, resourceObject) {
  var liLink = document.createElement('a');
  var liList = document.createElement('li'); 
  var liContainer = document.createElement('div'); 
  liLink.id = resourceObject.name.toLowerCase().split(" ").join('-'); 
  var name = resourceObject.name; 
  var website = resourceObject.website;
  var bio = resourceObject.bio;
  var telephone = resourceObject.telephone; 
  var type = resourceObject.type; 
  var coordinates = resourceObject.coordinates; 
 
  liLink.onclick = function(e) {
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML('<h4>' + name + '</h4>' + '<a href=' + website + '>' + website + '</a>' + '<br><br>' + '<i>' + bio + '</i>' + '<br><br><b>Telephone: </b>' + telephone)
      .addTo(map);
  }

  liContainer.id = resourceObject.name; 
  liLink.innerHTML = resourceObject.name;
  liLink.className = 'resource-entry';
  liList.className = 'collapsed '+ liLink.id;
  liContainer.className = 'resource-entry-box';
  
  liContainer.appendChild(liLink); 
  liList.appendChild(liContainer); 

  return liList; 
}