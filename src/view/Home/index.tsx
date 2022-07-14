import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    history.push('/product');
  }, []);

  return <div className="home"></div>;
};

export default Home;
