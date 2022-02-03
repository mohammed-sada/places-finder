import React from 'react';

export default function Banner({ btnText, handleOnClick, error }) {
  return (
    <div className='bannerContainer'>
      <h1 className='bannerTitle'>
        Welcome to <span>Coffee Stores Finder</span>
      </h1>
      <p className='bannerText'>Discover you local coffee stores</p>
      <button className='button' onClick={handleOnClick}>
        {btnText}
      </button>
      {error && <p className='bannerText text-secondary'>{error}</p>}
    </div>
  );
}
