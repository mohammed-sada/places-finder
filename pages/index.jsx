import { useEffect, useContext } from 'react';
import Head from 'next/head';

import { Banner, Cards } from '../components';
import { useTrackLoaction } from '../hooks';
import { fetchPlaces } from '../lib/coffee-stores';
import { ACTION_TYPES, StoreContext } from '../context/StoreContext';

export async function getStaticProps(context) {
  // We surely know that the home page will always have these 6 coffee stores, so we pre-render them
  const coffeeStores = await fetchPlaces();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { trackLocation, locating, locationError } = useTrackLoaction();
  const { state, dispatch } = useContext(StoreContext);

  const { latLong, localCoffeeStores } = state;
  useEffect(() => {
    // Client Side Rendering because we don't know yet the location of the user, so we can't pre-render the data
    async function getLocalCoffeeStores(latLong) {
      try {
        const response = await fetch(
          `/api/getPlacesByLocation?latLong=${latLong}&query=${'coffee stores'}&limit=${10}`
        );
        const localStores = (await response.json()).data;
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: { localCoffeeStores: localStores },
        });
      } catch (error) {
        console.log(error);
      }
    }
    latLong && getLocalCoffeeStores(latLong);
    // because when the page first render, the function will be called even if we don't click the button

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    trackLocation();
  };

  return (
    <div>
      <Head>
        <title>Coffee Stores Finder</title>
        <meta
          name='description'
          content='Coffee stores finder to find all of the coffee stores near your current loaction.'
        />
      </Head>

      <main>
        <Banner
          btnText={locating ? 'Locating ...' : 'View stores nearby'}
          error={locationError}
          handleOnClick={handleOnBannerBtnClick}
        />

        <Cards data={localCoffeeStores} header={'Stores Near Me'} />
        <Cards data={props.coffeeStores} header={'Torono Stores'} />
      </main>
    </div>
  );
}
