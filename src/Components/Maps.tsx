import tt from '@tomtom-international/web-sdk-maps'
import React, { useEffect, useRef, useState } from 'react'
import * as ttapi from '@tomtom-international/web-sdk-services'
import "../App.css"
export default function Maps() {
    const mapElement = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<tt.Map>();
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

    useEffect(() => {
        const successCallback = (position: GeolocationPosition) => {
            setLatitude(position.coords.latitude ?? 1.32);
            setLongitude(position.coords.longitude ?? 103.234);

          };
          
          const errorCallback = (error) => {
            console.log(error);
          };
          
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        const map = tt.map({
            key: "ZHTzbVIJuUS5mKdWZibARb8AmUGGEZzs",
            container: mapElement.current ?? "",
            center: [longitude , latitude ],
            zoom: 14,
            stylesVisibility: {
              trafficFlow: true,
              trafficIncidents: true
            },
            
          
        });
        const addMarker = () => {
          const popupOffset = {
            bottom: [0, -15]
          };
          const popup = new tt.Popup({offset: {bottom: [0, -15]}}).setHTML('This is you!')
          const element = document.createElement('div');
          element.className = 'marker';
    
          const marker = new tt.Marker({
            draggable: true,
            element: element,
          })
            .setLngLat([longitude, latitude])
            .addTo(map);
          
          marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            setLongitude(lngLat.lng);
            setLatitude(lngLat.lat);
          });
    
          marker.setPopup(popup).togglePopup();
          
        };
        map.on('click', (e) => {
          console.log(e.lngLat);
        })
        let sorted = [
          
          {
            lat: 17.4307564,
            lng: 78.3708978
          },{
            lat: 17.4577589 ,
            lng: 78.3606787
          }

        ]
        const drawRoute = (geoJson, map) => {
          if (map.getLayer('route')) {
            map.removeLayer('route')
            map.removeSource('route')
          }
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geoJson
            },
            paint: {
              'line-color': '#4a90e2',
              'line-width': 6
        
            }
          })
        }
        const recalculateRoutes = () => {
          ttapi.services
              .calculateRoute({
                key: "ZHTzbVIJuUS5mKdWZibARb8AmUGGEZzs",
                locations: sorted,
              })
              .then((routeData: ttapi.CalculateRouteResponse) => {
                const geoJson = routeData.toGeoJson()
               drawRoute(geoJson, map);
            }).catch((e) => {
              console.log(e);
            })
          
    
            
    };
        addMarker();
        setMap(map);
        recalculateRoutes();
    }, [longitude, latitude]);
    

  return (
    <div>
        <div ref={mapElement} className='map'></div>
    </div>
  );
}
