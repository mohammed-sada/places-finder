import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DEFAULT_IMG = '/static/coffee.jpg';

export default function Card({ cardImg, cardLink, cardHeader }) {
  return (
    <Link href={cardLink}>
      <a className='cardLink'>
        <h2 className='cardHeader'>{cardHeader}</h2>
        <Image
          className='cardImage'
          src={cardImg || DEFAULT_IMG}
          width={400}
          height={200}
          alt={cardHeader}
        />
      </a>
    </Link>
  );
}
