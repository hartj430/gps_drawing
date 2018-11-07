'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFydGo0MzAiLCJhIjoiY2puZjc3c3BrMGJuYjN3bmJnZnNjNjJ0dSJ9.dvHzfzL7lwR6Xul3ukLqPA'

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hartj430/cjo7ebb0l09fq2sldwznwmetn',
    center: [-73.96216,40.80779],
    zoom: 16
})

let navigation = new mapboxgl.NavigationControl({
    showCompass: false
})

map.addControl(navigation, 'top-left')

let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
})

map.addControl(scale, 'bottom-right')

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
})
map.addControl(geolocate, 'top-left')
let current_location = [-73.96216, 40.80779]

// update the variable whenever a geolocation event fires
geolocate.on('geolocate', function(event) {
    current_location = [event.coords.longitude, event.coords.latitude]
    console.log('geolocated', current_location)   

     if (active) {                           // if we're drawing
        path.push(current_location)         // add the current location to the path
     map.getSource('drawing').setData(geojson)

    }
})

// for testing purposes, also update the variable whenever you click on the map
//map.on('click', function(event) {
  // current_location = [event.lngLat.lng, event.lngLat.lat]
  // console.log('clicked', current_location)     

  //   if (active) {                           // if we're drawing
   //     path.push(current_location)         // add the current location to the path
  //     console.log(path)                   // ...and for testing purposes, log the path so far to the console.
 //  map.getSource('drawing').setData(geojson) 

  //  }

// })

map.on('load', function() {             // 'load' event handler
    map.addLayer({                      // add a layer
        'id': 'drawing',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': null
        },
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#50C3DF',
            'line-width': 5,
            'line-opacity': .8
        }
})
   
 db.get(function(data) {
        for (let item of data) {
            if (!item.path) continue
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": item.path
                }
            })
            map.getSource('drawing').setData(geojson)
        }
    })

  
})

let draw_btn = document.getElementById('draw_btn')

// a handler that is called when the button is clicked
draw_btn.addEventListener('click', function() {

    // print something in the console to test
    console.log('clicked draw_btn')                 
 if (active) {            // if we're already drawing, stop drawing
        stopDrawing()
    } else {                    // otherwise, start drawing
        startDrawing()
    }


})

let geojson = {
    "type": "FeatureCollection",
    "features": []
}


let active = false
let start_marker = new mapboxgl.Marker() 
let path = []     

function startDrawing() {

    active = true

    start_marker.setLngLat(current_location)
    start_marker.addTo(map)

    draw_btn.style['background-color'] = "red"         // make the button red
    draw_btn.style['color'] = "white"                  // make it's text white
    draw_btn.value = 'Stop and save'                   // change the text to the opposite state

path.push(current_location)         // add the current location to the path

  geojson.features.push({                     // add a new feature to the geojson
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": path                 // the coordinates of this feature are our path array
        }
    })    
    map.getSource('drawing').setData(geojson)   // update the drawing layer with the latest geojson

}


function stopDrawing() {

    active = false

    draw_btn.style['background-color'] = "white"      // make the button white again
    draw_btn.style['color'] = "black"                 // make the text black
    draw_btn.value = 'Start'                          // change the text
db.insert(path)                         // insert the path into the database
path = []  

}


     



     





    


