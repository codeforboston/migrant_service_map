import mapboxgl from 'mapbox-gl';


export function getResourceObject(sources){
  var resourceObject = sources.map( i => {
      var resource = i.properties; 
      resource.coordinates = i.geometry.coordinates; 
      resource.lngLat = i.lngLat; 
      return resource; 
    }); 
  return resourceObject; 
}

// get the types from mapbox data
export function getCategories(sources){
  return sources.map(source => source.properties.type)
    .filter((value, index, self) => self.indexOf(value) === index ); 
};

export function makeResourceEntry(resourceObject) {
  var liLink = document.createElement('a');
  var liList = document.createElement('li'); 
  var liContainer = document.createElement('div'); 
  liLink.id = resourceObject.name.toLowerCase().split(" ").join('-'); 
  var name = resourceObject.name; 
  var website = resourceObject.website;
  var bio = resourceObject.bio;
  var telephone = resourceObject.telephone;
  var coordinates = resourceObject.coordinates; 
 
  liLink.onclick = function(e) {
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML('<h4>' + name + '</h4><a href=' + website + '>' + website + '</a><br><br><i>' + bio + '</i><br><br><b>Telephone: </b>' + telephone)
      // .addTo(map);
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