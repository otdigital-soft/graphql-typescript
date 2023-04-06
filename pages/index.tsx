import React, { FC } from 'react';
import 'twin.macro';
import getConfig from 'next/config';
import { setCapitalForWords } from '@utils/general';
const { publicRuntimeConfig } = getConfig();

type AppData = {
  products: any[];
  shopifyProducts: any;
};

const Home: FC<AppData> = () => {
  const brands = Object.keys(publicRuntimeConfig);

  return (
    <div tw="pt-20 pl-20">
      <h1 tw="text-2xl">Welcome to Smart theme</h1>
      <h2 tw="text-lg py-5">Please select Brands</h2>
      <div tw="flex flex-col gap-y-2">
        {brands.map((brand, index) => (
          <a key={index} href={`/${brand}/collections/all-products`}>
            <span tw="text-blue hover:underline cursor-pointer">
              {setCapitalForWords(brand)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;
