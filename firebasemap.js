// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWtre37BeCih-MgzZ_L1yPSdsQUpxjcpk",
  authDomain: "delivery-tracker-b4dce.firebaseapp.com",
  databaseURL: "https://delivery-tracker-b4dce-default-rtdb.firebaseio.com",
  projectId: "delivery-tracker-b4dce",
  storageBucket: "delivery-tracker-b4dce.appspot.com",
  messagingSenderId: "997800949603",
  appId: "1:997800949603:web:9b8e44990a640f8444c556",
  measurementId: "G-D5SB0E6WPD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to initialize the map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const map = new Map(document.getElementById('map'), {
    center: { lat: 7.2571, lng: 5.2058 }, // Default center coordinates
    zoom: 16,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }] // Turn off points of interest.
      },
      {
        featureType: 'transit.station',
        stylers: [{ visibility: 'off' }] // Turn off bus stations, train stations, etc.
      }
    ],
    disableDoubleClickZoom: true,
    streetViewControl: false
  });

  // Fetch location data from Firebase
  fetchLocationData(map);

  // Create the DIV to hold the control and call the makeInfoBox() constructor
  const infoBoxDiv = document.createElement('div');
  const infoBox = new makeInfoBox(infoBoxDiv, map);
  infoBoxDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);
}

// Function to fetch location data from Firebase Realtime Database
function fetchLocationData(map) {
  const locationRef = database.ref('/');
  console.log(locationRef);

  locationRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const latitude = data.lat;
      const longitude = data.lng;

      // Set the map center to the fetched location
      map.setCenter({ lat: latitude, lng: longitude });

      // Add a marker to represent the current location
      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6, // Size of the blue dot
          fillColor: '#4285F4', // Blue color
          fillOpacity: 1,
          strokeColor: 'white', // Outline color
          strokeWeight: 2,
        },
      });

      // Add an accuracy circle if desired
      new google.maps.Circle({
        strokeColor: "#4285F4",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4285F4",
        fillOpacity: 0.35,
        map: map,
        center: { lat: latitude, lng: longitude },
        radius: 50, // Example radius in meters
      });
    } else {
      console.error("Location data not found in Firebase.");
    }
  }, (error) => {
    console.error("Error fetching data from Firebase:", error);
  });
}

// Dummy makeInfoBox function to avoid errors (replace with your actual implementation)
function makeInfoBox(controlDiv, map) {
  // Implement your makeInfoBox logic here
}
initMap();