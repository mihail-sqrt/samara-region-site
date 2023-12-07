import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import { getCookieToken } from '../utils/utils';
import { YMaps, Map, Placemark, SearchControl, Clusterer } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Category, Place, URL_SERVER, deleteById, getData } from '../utils/backend';
import PlaceItem from '../components/PlaceItem';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';

function FragmentPlaces({ setFragment }: { setFragment?: any }) {
    const [formData, setFormData] = useState<{
        name: string;
        card_description: string;
        description: string;
        category: number[];
        images: File[];
        coordinates: string;
        rate: number;
        price: number;
        city: string;
        location: string;
        walk: boolean;
        time: number;
        id?: any;
    }>({
        name: '',
        card_description: '',
        description: '',
        category: [],
        images: [] as File[],
        coordinates: '53',
        rate: 0,
        price: 0,
        city: '',
        location: '',
        walk: false,
        time: 0,
        id: -1
    });

    const [point, setPoint] = useState();
    const [places, setPlaces] = useState<Place[]>([]);
    const map = useRef<any>(null);
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [type, setType] = useState("add");
    const navigate = useNavigate();
    const [alertShow, setAlertShow] = useState(false);
    const [alertContent, setAlertContent] = useState("Успешно!");

    function alert(text: string) {
        setAlertShow(true);
        setAlertContent(text);
        setTimeout(() => {
            setAlertShow(false);
        }, 1500)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData((prevState) => ({
                ...prevState,
                images: [...prevState.images, ...Array.from(files)],
            }));
        }
    };

    function loadMap(yamap: YMapsApi) {
        console.log(yamap.map?.GeoObjects)
        // yamap.map.GeoObjects.events.add("click", (e: any) => {
        //     console.log(e)
        //     var coords = e.get('coords');
        //     alert(coords.join(', '));
        // });
    }

    const handleSubmit = async () => {
        const cookieToken = getCookieToken();
        let token = null;
        if (cookieToken) {
            token = cookieToken.split('=')[1];
        }

        if (token) {
            try {
                const formDataToSend = new FormData();
                Object.keys(formData).forEach((key) => {
                    if (key !== 'images') {
                        formDataToSend.append(key, (formData as any)[key]);
                    }
                });
                if (formData.images.length > 0) {
                    console.log("formData.images", formData.images)
                    formDataToSend.append('image', formData.images[0], formData.images[0].name);
                }
                formDataToSend.append("type", "places");
                const response = await fetch(URL_SERVER+`/${type == 'edit' ? "edit" : "add"}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //'Content-Type': 'multipart/form-data'
                    },
                    body: formDataToSend,
                });
                document.location.reload();
                if (response.ok) {
                    alert("Успешно!");
                    console.log('Data added successfully');
                } else {
                    alert("Произошла ошибка");
                    console.error('Failed to add data');
                }
            } catch (error) {
                alert("Произошла ошибка");
                console.error('Error:', error);
            }
        }
    };

    async function handleDelete() {
        const result = await deleteById(formData?.id, 'places');
        alert("Успешно!");
        navigate(0)
    }

    async function loadCategorys() {
        const data = await getData("category");
        const places_data = await getData("places");
        if (places_data) {
            setPlaces(places_data as Place[]);
        }
        if (data) {
            setCategorys(data);
        }
    }

    useEffect(() => {
        loadCategorys();//da
    }, [])

    return (
        <>
            {alertShow && <Alert content={alertContent} />}
            <div className="flex flex-row w-[100%] justify-between">
                <div className='flex flex-col w-[50%]'>
                    <div className="mb-6">
                        <label
                            htmlFor="default-input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Название
                        </label>
                        <input
                            type="text"
                            name='name'
                            id="default-input"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Краткое описание</label>
                        <textarea id="message"
                            value={formData.card_description} onChange={handleInputChange}
                            name='card_description'
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Гора стрельная..."></textarea>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                        <textarea id="message"
                            value={formData.description} onChange={handleInputChange}
                            name="description"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Гора стрельная..."></textarea>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Город</label>
                        <input
                            type="text"
                            name='city'
                            id="default-input"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Локация (местность где находится)</label>
                        <input
                            type="text"
                            name='location'
                            id="default-input"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Координаты</label>
                        <input
                            type="text"
                            name='coordinates'
                            id="default-input"
                            value={point}
                            onChange={(event) => {
                                if (event.target.value.includes(",")) {
                                    setPoint(event.target.value.split(",") as any)
                                }
                                handleInputChange(event)
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className="mb-6">
                        <a className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категории</a>
                        {
                            categorys.map((item) => (
                                <button className={`bg-[#FEEFD7] px-10 py-3 mb-[10px] rounded-2xl font-medium mt-auto w-full ${formData.category.includes(item.id) ? " bg-white" : ""}`} onClick={() => {
                                    if (formData?.category?.includes(item.id)) {
                                        console.log(formData?.category)
                                        const new_cat = formData?.category?.filter(cat => cat !== item.id);
                                        setFormData({ ...formData, category: new_cat })
                                    } else {
                                        setFormData({ ...formData, category: [...formData.category, item.id] })
                                    }
                                }}>{item.name}</button>
                            ))
                        }
                        <button className='bg-[#b9eaff] px-10 py-5 rounded-2xl font-medium my-2 w-full' onClick={() => { loadCategorys() }}>Обновить категории</button>
                        <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={() => { setFragment("category") }}>Добавить</button>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                        <input
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="file_input_help" id="file_input" type="file" />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                    </div>
                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={handleSubmit}>{type == 'edit' ? "Сохранить" : "Добавить"}</button>
                    {
                        type == "edit" &&
                        <button className='bg-[#ff6f6f] text-white px-10 py-5 rounded-2xl font-medium mt-2 w-full' onClick={handleDelete}>Удалить</button>
                    }
                </div>
                <YMaps>
                    <section className='w-1/2 h-inherit px-[5%]'>
                        <Map
                            className='w-full h-full'
                            onLoad={loadMap}
                            instanceRef={map}
                            onClick={(e: any) => {
                                const coords = e.get("coords");
                                console.log('eeerasereres', coords)
                                setPoint(coords)
                                setFormData({ ...formData, coordinates: coords })
                            }}
                            defaultState={{ center: [53.195876, 50.100186], zoom: 9 }}>
                            <Clusterer
                                options={{
                                    preset: 'islands#invertedVioletClusterIcons',
                                    groupByCoordinates: false,
                                }}
                            >
                                {point &&
                                    <Placemark
                                        options={{
                                            iconColor: "red"
                                        }}
                                        geometry={point}
                                    />
                                }
                                {
                                    places && places.length > 0 && places.map(place =>
                                        <Placemark
                                            options={{
                                                iconColor: "red"
                                            }}
                                            properties={{
                                                hintContent: place.name,
                                                balloonContent: `${place.name}<br/>${place.card_description}`,
                                                layoutContent: place.name
                                            }}
                                            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                            geometry={place.coordinates.split(',')}
                                        />
                                    )
                                }
                            </Clusterer>
                        </Map>
                    </section>
                </YMaps>
            </div>
            <h1 className='text-2xl font-medium text-[#2C2C2C] mt-2'>Все места</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full h-full gap-5 mt-7'>
                {places && places.length > 0 && places.map((item) => (
                    <PlaceItem onClick={() => {
                        // console.log(item.coordinates, item?.coordinates.split(','), item?.category?.split(","))

                        setPoint((item?.coordinates.split(',') as any) || [0, 0])
                        setFormData({ ...item, card_description: item.card_description, images: [], category: [], coordinates: item?.coordinates.split(',') } as any);
                        setType('edit')
                    }} data={item as any} />
                ))}
            </div>
        </>
    )
}

export default FragmentPlaces;