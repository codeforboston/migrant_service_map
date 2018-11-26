
function getResourceObject(){
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

function makeResourceEntry(resourceObject) {
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

function makeSectionHeader(category){
  var liEntry = document.createElement('li'),
      icon = document.createElement('i'),
      chevron = document.createElement('chevron'),
      aEntry = document.createElement('a'),
      titleA = document.createElement('a'),
      h2Wrap = document.createElement('h2'),
      categoryId = category.toLowerCase().split(" ").join('-');
  
  aEntry.href = "#" + categoryId; 
  aEntry.id = categoryId;
  aEntry.onclick = toggleResourceEntries;
  aEntry.innerText = category;

  icon.className = 'fa fa-tree'
  chevron.className = 'fa fa-chevron-down';
  titleA.className = 'header-box';
  liEntry.className = 'menu-section-head';

  titleA.appendChild(icon);
  titleA.appendChild(h2Wrap).appendChild(aEntry);
  titleA.appendChild(chevron);
  liEntry.appendChild(titleA);

  return liEntry; 
}

function makeSection(category){  
  var categoryId = category.toLowerCase().split(" ").join('-'); 
  var resourceObject = getResourceObject(); 
  var ulResource = document.createElement('ul');
  ulResource.className = 'resource-section collapsed ' + categoryId;

    for (var i = 0; i < resourceObject[category].length; i++ ) {
      var entry = makeResourceEntry(resourceObject[category][i]);
      entry.className += " " + categoryId; 
      ulResource.appendChild(entry);
  }

  return ulResource; 
};

function assembleMenu(){
  var context = document.getElementById('menu_container');
  var menuObject = getResourceObject();
  var sectionHeads = Object.keys(menuObject); 
  
  for (var i = 0; i < sectionHeads.length; i++) {
      var header = makeSectionHeader(sectionHeads[i]);
      var section = makeSection(sectionHeads[i]);
      var liSection = document.createElement('li');
      var myId = sectionHeads[i].toLowerCase().split(" ").join('-');
      liSection.className += " " + myId; 
      header.className += " " + myId; 
      context.appendChild(header);
      liSection.appendChild(section); 
      context.appendChild(liSection);
  }
  return context; 
};


function toggleResourceEntries(e) {
  e.preventDefault()
  
  if (map.getLayoutProperty(e.target.id, 'visibility') === 'none') {
    map.setLayoutProperty(e.target.id, 'visibility', 'visible');
  } else {
    map.setLayoutProperty(e.target.id, 'visibility', 'none');
  };

  var mySectionHead = e.srcElement.parentElement.parentElement.parentElement
  mySectionHead.classList.toggle('open');

  var mySection = document.getElementsByClassName('resource-section ' + e.target.id);

  mySection[0].parentElement.classList.toggle('collapsed');
  
  var targets = document.getElementsByClassName(e.target.id);
  for (var i = 0; i < targets.length; i++) {
    var mytarget = targets[i]; 
    mytarget.classList.toggle('collapsed');
    // mytarget.parentElement.classList.toggle('collapsed');
  }

}




