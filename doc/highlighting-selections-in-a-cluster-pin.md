# Highlighting Selected Locations in a Cluster Pin

Participants:
* Maia
* Alex
* Sasha
* Byron
* Rachel
* Eduardo

We've discussed three options for handling when the user clicks on location in
the list that is currently in a clustered pin on the map.

* Highlight the entire cluster
* "Pop out" the selected location, decreasing the number in the cluster pin.
   Stay out?
   Animated?
* Removing cluster pins altogether

## Highlight the entire cluster

### How it Works

Clicking on the location will cause the cluster pin the location is in to be
highlighted.

When the cluster pin is separated into individual pins, only the selected
location remains highlighted.

### Pros

* Cluster-pins behave more consistently with non-cluster pins
* Simpler to implement within the time frame
* Design approved

### Cons

* Might appear to the service provider that they chose the entire cluster
* Doesn't tell you which one is selected
* Can't tell how many are selected if more than one is selected

### 10/12/19 discussion

We can avoid the first two cons by animating a single provider icon when the provider is selected. When the animation stops, the marker fades out, and the containing cluster changes colors to indicate the selected icon. This should look like the provider marker appears, then "melts" back into the cluster. 

## "Pop out" selected location

### How it Works

Clicking on the location will remove it from the cluster pin and reveal it at
its actual location. The individual pin will be highlighted.

The count on the cluster pin will decrease by 1.

When deselecting the location, its individual pin will be removed and the
cluster pin's count will increase by 1.

### Condiderations

* Should the individual pin be animated?

### Pros

* Clearly identifies which item was picked and where it is on the map
* Consistent visual design of what a selected icon looks like, across zoom
  levels

### Cons

* When the location is deselected, the icon disappears, which might be confusing
  to the service worker using the tool.
* Selected icons might get crowded without clustering
* Most development time to implement
  * ~3 Tuesday nights and Tuesday nights only
  * 2 full-time days
* Needs more time to finalize design
* Also requires reworking
* Need to rework bounding boxes for pins; pins too close together will both get
  clicked

## Removing cluster pins

No more cluster pins! All pins are shown by default at all zoom levels.  We
could defer to type and range filters to limit what's shown.

Since we now have the type icon inside a pin icon, it might be less noisy than
it was initially.

### Pros

* Simpler UX

### Cons

* Need to rework highlighting
* Need to rework bounding boxes for pins; pins too close together will both get
  clicked
