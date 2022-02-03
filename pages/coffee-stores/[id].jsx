import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { FaLocationArrow, FaArrowLeft } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';

import { Loading } from '../../components';
import { fetchPlaces } from '../../lib/coffee-stores';
import { StoreContext } from '../../context/StoreContext';
import { isEmpty } from '../../utils';

const DEFAULT_IMG = '/static/coffee.jpg';

export async function getStaticProps(staticProps) {
  const { id } = staticProps.params;
  const coffeeStores = await fetchPlaces();
  return {
    props: {
      coffeeStore:
        coffeeStores.find((store) => store.id.toString() === id) || {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchPlaces();
  const paths = coffeeStores.map((store) => {
    return {
      params: { id: store.id.toString() },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const handleUpvote = () => {
  console.log('upvote');
};

export default function CoffeeStore(initialProps) {
  const router = useRouter();
  const { id } = router.query;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { localCoffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (localCoffeeStores.length > 0) {
        const coffeeStoreFromContext = localCoffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
        }
      }
    }
  }, [id, localCoffeeStores, initialProps]);

  if (router.isFallback) {
    return <Loading />;
  }
  const { name, address, street, imgUrl } = coffeeStore;
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <main>
        <StoreHeader name={name} />
        <StoreBody
          name={name}
          imgUrl={imgUrl}
          address={address}
          street={street}
        />
      </main>
    </div>
  );
}

const StoreHeader = ({ name }) => {
  return (
    <div className='storeHeader'>
      <Link href='/'>
        <a className='backLink'>
          <FaArrowLeft />
          Back to Home
        </a>
      </Link>
      <div className='divider' />
      <h2 className='storeHeaderText'>{name}</h2>
    </div>
  );
};

const StoreData = ({ Icon, text }) => {
  return (
    <div className='storeData'>
      <Icon />
      <h4 className='storeDataText'>{text}</h4>
    </div>
  );
};

const StoreBody = ({ name, imgUrl, address, street }) => {
  return (
    <div className='storeContainer'>
      <Image
        className='storeImg'
        src={imgUrl?.regular || DEFAULT_IMG}
        alt={name}
        width={600}
        height={340}
      />
      <div className='storeInfo'>
        {address && <StoreData Icon={HiLocationMarker} text={address} />}
        {street && <StoreData Icon={FaLocationArrow} text={street} />}
        <StoreData Icon={AiFillStar} text={8} />

        <button className='button' onClick={handleUpvote}>
          Up vote!
        </button>
      </div>
    </div>
  );
};
