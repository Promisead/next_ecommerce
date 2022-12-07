import React, { useState, useContext, useEffect, useRef } from 'react';
import { PaystackButton } from 'react-paystack';
//import { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../components/ProductsContext';
import Layout from '../components/Layout';
import emailjs from '@emailjs/browser';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutPage = () => {
  const formRef = useRef();

  const publicKey = 'pk_test_31b1425b05b098eaa970a2ab3a8a935b2b4f001b';
  const amount = 1000000;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    toast.success('Shipping Info Submitted Successfully!');

    emailjs
      .sendForm(
        'service_xwxc4ui',
        'template_y2deibh',
        formRef.current,
        's5XWvVJMHRbTuB8Em'
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch('/api/products?ids=' + uniqIds.join(','))
      .then((response) => response.json())
      .then((json) => setProductsInfos(json));
  }, [selectedProducts]);

  function moreOfThisProduct(id) {
    setSelectedProducts((prev) => [...prev, id]);
  }
  function lessOfThisProduct(id) {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  }

  const deliveryPrice = 2000;
  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find((p) => p._id === id)?.price || 0;
      subtotal += price;
    }
  }
  const total = subtotal + deliveryPrice;

  const componentProps = {
    email,
    amount: total * 100,
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: 'Pay Now',
    onSuccess: () =>
      toast.success('Thanks for doing business with us! Come back soon!!'),
    onClose: () => toast.error("Wait! Don't leave :("),
  };

  return (
    <Layout>
      {!productsInfos.length && <div>no products in your shopping cart</div>}
      {productsInfos.length &&
        productsInfos.map((productInfo) => {
          const amount = selectedProducts.filter(
            (id) => id === productInfo._id
          ).length;
          if (amount === 0) return;
          return (
            <div className="flex mb-5 items-center" key={productInfo._id}>
              <div
                className="bg-gray-100 p-3 rounded-xl shrink-0"
                style={{ boxShadow: 'inset 1px 0px 10px 10px rgba(0,0,0,0.1)' }}
              >
                <img className="w-24" src={productInfo.picture} alt="" />
              </div>
              <div className="pl-4 items-center">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <p className="text-sm leading-4 text-gray-500">
                  {productInfo.description}
                </p>
                <div className="flex mt-1">
                  <div className="grow font-bold">₦{productInfo.price}</div>
                  <div>
                    <button
                      onClick={() => lessOfThisProduct(productInfo._id)}
                      className="border border-emerald-500 px-2 rounded-lg text-emerald-500"
                    >
                      -
                    </button>
                    <span className="px-2">
                      {
                        selectedProducts.filter((id) => id === productInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={() => moreOfThisProduct(productInfo._id)}
                      className="bg-emerald-500 px-2 rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      <div className="container">
        <div className="item"></div>
        <div className="checkout-form">
          <form ref={formRef}>
            <div className="mt-8">
              <input
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                type="text"
                placeholder="Street address, number"
              />
              <input
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                type="text"
                placeholder="City and postal code"
              />
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                type="text"
                placeholder="Your name"
              />
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                type="email"
                placeholder="Email address"
              />
            </div>
            <div className="mt-8">
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                <h3 className="font-bold">₦{subtotal}</h3>
              </div>
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                <h3 className="font-bold">₦{deliveryPrice}</h3>
              </div>
              <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
                <h3 className="grow font-bold text-gray-400">Total:</h3>
                <h3 className="font-bold">₦{total}</h3>
              </div>
            </div>
            <input
              type="hidden"
              name="products"
              value={selectedProducts.join(',')}
            />
          </form>
          <div className="flex  space-x-4 justify-between ">
            <div className=" bg-emerald-500 px-5 py-2 rounded-xl  flex-row font-bold text-white w-24 my-4 shadow-emerald-300 shadow-lg">
              <PaystackButton {...componentProps} />
            </div>
            <button
              type="submit"
              onClick={sendEmail}
              className=" px-5 py-2 rounded-xl justify-items-right  flex-row font-bold border border-emerald-500   text-emerald-500 w-24 my-4 shadow-emerald-300 shadow-lg bg-white-500"
            >
              Pay On Delivery
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
