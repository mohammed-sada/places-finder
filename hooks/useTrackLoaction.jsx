import { useContext, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../context/StoreContext';

export default function useTrackLoaction() {
  const { dispatch } = useContext(StoreContext);

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationError('');
    setLocating(false);
  }

  function error() {
    setLocationError('Can not retrieve your location 😐');
    setLocating(false);
  }

  function trackLocation() {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support geolocation 😐');
      setLocating(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return { trackLocation, locating, locationError };
}
