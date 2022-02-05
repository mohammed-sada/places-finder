import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import useSWR from 'swr';

import { FaLocationArrow, FaArrowLeft } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';

import { Loading } from '../../components';
import { fetchPlaces } from '../../lib/coffee-stores';
import { StoreContext } from '../../context/StoreContext';
import { fetcher, isEmpty } from '../../utils';

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

export default function CoffeeStore(initialProps) {
  const router = useRouter();
  const { id } = router.query;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [voteDisabled, setVoteDisabled] = useState(false);

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
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      initialProps.coffeeStore &&
        handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, localCoffeeStores, initialProps]);

  async function handleCreateCoffeeStore(coffeeStore) {
    const { id, name, address, street, imgUrl } = coffeeStore;
    try {
      const response = await fetch(
        'http://localhost:3000/api/createCoffeeStore',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            id,
            name,
            address,
            street,
            voting: 0,
            imgUrl,
          }),
        }
      );
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(
    id ? `/api/getCoffeeStoreById?id=${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (data && data.data) {
      const record = {
        ...data.data,
        imgUrl: JSON.parse(data.data.imgUrl),
      };
      setCoffeeStore(record);
      setVotingCount(record.voting);
    }
  }, [data]);

  const handleUpvote = async () => {
    try {
      setVoteDisabled(true);
      const response = await fetch(`/api/favouriteCoffeeStore?id=${id}`, {
        method: 'PUT',
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore) {
        setVotingCount((count) => ++count);
        setVoteDisabled(false);
      }
    } catch (err) {
      console.error('Error upvoting the coffee store', err);
    }
  };

  if (error) {
    console.error(error);
  }

  if (router.isFallback || !coffeeStore) {
    return <Loading />;
  }
  const { name, address, street, imgUrl } = coffeeStore;
  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta
          name='description'
          content={`${name} Coffee Store, ${address}/ ${street}. \n ${votingCount} have voted for this coffee store!`}
        />
      </Head>
      <main>
        <StoreHeader name={name} />
        <StoreBody
          name={name}
          imgUrl={imgUrl}
          address={address}
          street={street}
          votingCount={votingCount}
          voteDisabled={voteDisabled}
          handleUpvote={handleUpvote}
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

const StoreBody = ({
  name,
  imgUrl,
  address,
  street,
  votingCount,
  voteDisabled,
  handleUpvote,
}) => {
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
        <StoreData Icon={AiFillStar} text={votingCount} />

        <button
          className='button'
          disabled={voteDisabled}
          onClick={handleUpvote}
        >
          Up vote!
        </button>
      </div>
    </div>
  );
};
