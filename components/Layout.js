import Footer from './Footer';
import { useContext, useEffect, useState } from 'react';
//import { ProductsContext } from './ProductsContext';

export default function Layout({ children }) {
  //  const { setSelectedProducts } = useContext(ProductsContext);
  const [success, setSuccess] = useState(false);
  /*  useEffect(() => {
    if (window.location.href.includes('success')) {
      setSelectedProducts([]);
      setSuccess(true);
    }
    s;
  }, []); */
  return (
    <div>
      <div className="p-5">{children}</div>
      <Footer />
    </div>
  );
}
