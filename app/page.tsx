import React from 'react'
import MainBanner from './_landing/main-banner';
import Categories from './_landing/categories';
import BestSeller from './_landing/best-seller';
import NewsLetter from './_landing/news-letter';

export default async function Home() {
    return (
        <div className='mt-10'>
            <MainBanner /> 
            <Categories /> 
            <BestSeller />
            <NewsLetter /> 
        </div>
    );
}
