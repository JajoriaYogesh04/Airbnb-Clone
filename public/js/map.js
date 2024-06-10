console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [75.7737, 26.9091], // starting position [lng, lat]
    zoom: 9 // starting zoom
});