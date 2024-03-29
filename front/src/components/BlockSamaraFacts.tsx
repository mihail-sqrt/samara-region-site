import { useEffect, useRef, useState } from 'react';
import ImageCard1 from '../assets/buti1.jpg';
import ImageCard2 from '../assets/buti2.jpg';
import ImageCard3 from '../assets/buti3.jpg';
import ImageCard4 from '../assets/buti4.jpg';
import ImageCard5 from '../assets/buti5.jpg';
import ImageCard6 from '../assets/buti6.jpg';
import useIsMobile from './isMobile';
// import ImageCard7 from './assets/buti7.jpg';
// import ImageCard8 from './assets/buti8.jpg'
;
const facts = [
    `
    1.12 апреля 1961 года первый космонавт Земли Юрий Гагарин совершил космический полет на корабле «Восток», выведенном в космос ракетой-носителем «Р-7», на 2/3 созданной в Самаре. После полета Юрий Гагарин приземлился около города Энгельс (Саратовская область) и на самолете прибыл в Куйбышев, где некоторое время отдыхал на одной из обкомовских дач на берегу Волги.
На следующий день, 13 апреля, с участием Юрия Гагарина и под председательством Сергея Королева состоялась собрание ученых и специалистов. Вечером того же дня - встреча с делегацией трудящихся и общественности Куйбышевской области.
    `,
    `
    В ходе Великой Отечественной войны (1941-1945) Куйбышев на некоторое время стал запасной столицей страны. Сюда были эвакуированы партийные и правительственные учреждения, Большой театр и дипломатические миссии 21 иностранного государства. В гостинице «Гранд-Отель» расположился зарубежный корреспондентский корпус. В 1941-1943 годы за дверями посольств готовились многие важные документы, определявшие во многом ход и исход второй мировой войны.`
    ,
    `
    В годы Великой Отечественной войны в Куйбышеве в эвакуации жил и работал величайший композитор двадцатого столетия Дмитрий Шостакович. Здесь была закончена и впервые исполнена его знаменитая Седьмая «Ленинградская» симфония. Гимн человечности прозвучал в исполнении оркестра Большого театра.
Замечательные воспоминания о первом впечатлении от музыки симфонии оставил писатель Алексей Толстой, также живший в Куйбышеве во время войны. По его словам, зрители были очарованы музыкой Шостаковича, в которой композитор воспел Человека, прошедшего через тяготы и беды, но не покорившегося обстоятельствам.
На следующий день после премьеры микрофильм партитуры был отправлен за рубеж. Началось её восторженное шествие по лучшим оркестрам мира.
    `,
    `
    Из эвакуированных во время Великой Отечественной войны заводов в Куйбышеве сформировался мощнейший авиакомплекс, выпускавший истребители МиГ-3 и известные штурмовики Ил-2 (самый массовый самолёт 1940-х годов). Один из них застыл на постаменте на кольце проспекта Кирова и Московского шоссе.
`,
    `
Кто не слышал о знаменитом «Жигулёвском пиве»? Пивной завод, построенный в 1881 году в Самаре австрийским дворянином Альфредом фон Вакано, работает до сих пор и является одним из символов города.
Желающие могут и сейчас полюбоваться на старинные здания, построенные в стиле немецкого ренессанса, купить в здании завода сувениры пивной тематики и, конечно, попробовать свежайшее «Жигулевское».`,
    `
Кумысолечебница Нестора Постникова - второе в мире кумысолечебное заведение (первое открыли в 1854 году тоже в Самарской губернии - в селе Богдановка).
В середине XIX века Постников, занимаясь медицинской практикой, заметил, что кислое кобылье молоко помогает при лечении туберкулеза. После этого врач в 1858 году на свои деньги в шести верстах от Самары построил кумысолечебницу.
За служение медицине Нестор Постников был награжден орденами Святой Анны двух степеней и орденом Святого Владимира. Земский врач Постников стал дворянином, а его имя было занесено в Дворянскую родословную книгу.
Сейчас в бывшей кумысолечебнице разместился Самарский областной клинический противотуберкулезный диспансер имени Н.В. Постникова.
`,
`
Самым крупным и красивым парком дореволюционной Самары считался Струковский сад, в котором впервые был исполнен вальс «На сопках Маньчжурии» (русский вальс начала XX века, посвящённый погибшим в русско-японской войне воинам 214-го резервного Мокшанского пехотного полка. Автор - военный капельмейстер полка Илья Шатров).
Парк расположен на склоне горы, в нем много цветочных клумб и ландшафтных композиций: бегемот, символ города – горный козел, огромные шахматные фигуры. Есть фонтаны, детские аттракционы, кафе. Летом каждые выходные в парке играет духовой оркестр.
Ежегодно в августе в Струковском саду проходит один из красивейших праздников Самары - Фестиваль цветов.
`
];

function BlockSamaraFacts() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [ImageCard1, ImageCard2, ImageCard3, ImageCard4, ImageCard5, ImageCard6];
    const isMobile = useIsMobile();

    const goToPreviousSlide = () => {
        const index = (activeIndex - 1 + images.length) % images.length;
        setActiveIndex(index);
    };

    const goToNextSlide = () => {
        const index = (activeIndex + 1) % images.length;
        setActiveIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(goToNextSlide, 5000); // переключение каждые 15 секунд
        return () => clearInterval(interval); // очистить интервал при размонтировании компонента
    }, [activeIndex]);

    return (
        <>
            <section
                className='w-full min-h-[50vh] bg-white py-[3%] px-[5%] flex max-md:flex-col flex-row'
            >
                <div className='max-md:w-full w-1/2 mb-6 max-md:min-h-[250px] md:pr-[5%] h-auto flex flex-col'>
                    <h1 style={{
                        color: "#2C2C2C",
                        fontWeight: "bold",
                        fontSize: isMobile ? 48 : 'calc(70px + 7 * ((100vw - 720px) / 1280))',
                        width: "auto",
                        letterSpacing: isMobile ? 1 : -4
                    }}
                        className='max-md:mb-4'
                    >
                        {"Самарская Область"}
                    </h1>

                    <p className="text-lg">
                        {facts[activeIndex]}
                    </p>
                </div>
                <div className='max-md:w-full relative max-md:h-[500px] w-1/2 '>
                    <div className="relative h-56 overflow-hidden rounded-[47px] md:h-96">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`duration-700 ease-in-out absolute w-full transform ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    transition: 'opacity 0.7s',
                                    zIndex: activeIndex === index ? 1 : 0
                                }}
                            >
                                <img src={image} className="w-full" alt="Чудса Самарского Края" />
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-row justify-end items-center mt-[24px] ml-auto'>
                        <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={goToPreviousSlide}>{'<'}</button>
                        <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px] min-w-[30px]'>{activeIndex + 1}/{images?.length}</h2>
                        <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={goToNextSlide}>{'>'}</button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlockSamaraFacts;