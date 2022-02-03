import React from 'react';
import Card from './Card';

export default function Cards({ data, header }) {
  if (!data.length > 0) return null;

  return (
    <div className='cardsContainer'>
      <div className='divider' />
      <h2 className='cardsLayoutHeader'>{header}</h2>
      <div className='cardsLayout'>
        {data.map((item) => {
          return (
            <Card
              key={item.id}
              cardImg={item.imgUrl?.small}
              cardLink={`/coffee-stores/${item.id}`}
              cardHeader={item.name}
            />
          );
        })}
      </div>
    </div>
  );
}
