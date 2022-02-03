import '../styles/globals.css';
import StoreProvider from '../context/StoreContext';

function MyApp({ Component, pageProps }) {
  return (
    <div className='pageContainer'>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}

export default MyApp;
