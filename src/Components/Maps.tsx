import tt from '@tomtom-international/web-sdk-maps'
import React, { useEffect, useRef, useState } from 'react'
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
            zoom: 15,
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
        addMarker();
        setMap(map);
    }, [longitude, latitude]);
    

  return (
    <div>
        <div ref={mapElement} className='map'></div>
    </div>
  );
}
