console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listings.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// console.log(listings.geometry.coordinates);
new mapboxgl.Marker({color: "red"})
.setLngLat(listings.geometry.coordinates)
.setPopup(new mapboxgl.Popup().setHTML(`<h5>${listings.title}</h5><p><i>Exact location will be provided after booking!</i></p>`))
.addTo(map);
