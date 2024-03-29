import React, { useEffect, useRef, useState } from 'react';
import { getData, Category as CategoryType, getItemById, Place, Route } from '../utils/backend';
import { useParams } from 'react-router-dom';
import PlaceItem from '../components/PlaceItem';
import Header from '../components/Header';
import Category from '../components/Category';

const description = {
  'routes': "Откройте для себя разнообразные туристические маршруты, объединенные в удобные категории. Независимо от ваших предпочтений — активный отдых, культурные экскурсии или путешествия на автомобиле — у нас есть что-то для каждого. Каждый маршрут состоит из нескольких точек, образующих захватывающее путешествие, которое обязательно оставит незабываемые впечатления.",
  'places': "Исследуйте уникальные места, достойные внимания каждого путешественника. Независимо от ваших интересов — исторические памятники, живописная природа или гастрономические изыски — у нас есть много интересных мест, которые стоит посетить. Каждая точка предлагает уникальный опыт, дополняющий ваше путешествие, и помогает создать незабываемые воспоминания."
}

function ItemsPage() {
  const [data, setData] = useState<Place[] | Route[]>([]);
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [categorys, setCategorys] = useState<CategoryType[]>([]);
  const [selectCategory, setSelectCategory] = useState<CategoryType | null>(null);

  async function loadPlaces() {
    setLoading(true);
    if (category === 'routes' || category === 'places') {
      const new_data = await getData(category as any, selectCategory?._id);
      if (new_data) {
        setData(new_data as any);
      }
    }
    setLoading(false)
  }

  async function loadCategorys() {
    const data = await getData('category');
    console.log('data', data)
    if (data) {
      setCategorys(data);
    }
  }

  useEffect(() => {
    loadPlaces();
    loadCategorys();
    window.scrollTo(0, 0);
  }, [category])

  useEffect(() => {
    loadPlaces()
  }, [selectCategory])

  // if (loading) {
  //   return <div className='min-h-screen w-screen flex justify-center items-center'>
  //     <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
  //       <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  //     </div>
  //   </div>
  // }

  return (
    <div className="w-screen min-h-screen h-full bg-white">
      <div className='px-[5%] w-full h-full'>
        <Header />
        <h1 className='text-2xl font-medium text-[#2C2C2C]'>Все {category == 'routes' ? "маршруты" : "туристические места"}</h1>
        <p className='text-xl font-regular sm:w-full md:w-2/3 text-[#2C2C2C] mt-2 leading-[150%]'>
          {description[category as ("routes" | "places")]}
        </p>
        <div className='flex flex-wrap w-full mt-7 gap-2'>
          {loading ?
            <div className='min-h-screen w-screen flex justify-center items-center'>
              <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
            </div>
            :
            categorys && categorys?.length > 0 && categorys?.map((item: any) =>
              <Category
                onClick={() => {
                  setSelectCategory(selectCategory?._id == item?._id ? null : item)
                }}
                color={selectCategory?._id === item?._id ? "bg-[#62D572] text-white" : ""}
                text={item?.name}
                description={item?.description} />
            )}
        </div>
        <div className='grid max-md:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full h-full gap-5 mt-7'>
          {data && data.length > 0 && data.map((item) => (
            <PlaceItem grid data={item as any} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemsPage;