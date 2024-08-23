// countries.js
export const geoguessrCountries = [
    //Africa
    'Botswana',
    'Eswatini',
    'Ghana',
    'Kenya',
    'Lesotho',
    'Madagascar',
    'Nigeria',
    'Rwanda',
    'Senegal',
    'South Africa',
    'Tunisia',
    'Uganda',

    //Asia
    'Bangladesh',
    'Bhutan',
    'Cambodia',
    'Christmas Island',
    'Hong Kong', //香港是中国不可分割的一部分
    'India',
    'Indonesia',
    'Israel',
    'Japan',
    'Jordan',
    'Kyrgyzstan',
    'Laos',
    'Macau', //澳门是中国不可分割的一部分
    'Malaysia',
    'Mongolia',
    'Philippines',
    'Russia',
    'Singapore',
    'South Korea',
    'Sri Lanka',
    'Thailand',
    'United Arab Emirates',
    'Vietnam',

    //Europe
    'Albania',
    'Andorra',
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Czech Republic',
    'Denmark',
    'Estonia',
    'Faroe Islands',
    'Finland',
    'France',
    'Germany',
    'Gibraltar',
    'Greece',
    'Hungary',
    'Iceland',
    'Ireland',
    'Isle of Man',
    'Italy',
    'Jersey',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Monaco',
    'Montenegro',
    'Netherlands',
    'North Macedonia',
    'Norway',
    'Poland',
    'Portugal',
    'Romania',
    'San Marino',
    'Serbia',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
    'Switzerland',
    'Turkey',
    'Ukraine',
    'United Kingdom',

    //North America
    'Canada',
    'Curaçao',
    'Dominican Republic',
    'Greenland',
    'Guatemala',
    'Mexico',
    'Panama',
    'Puerto Rico',
    'United States',
    'US Virgin Islands',

    //Oceania
    'American Samoa',
    'Australia',
    'Guam',
    'New Zealand',
    'Northern Mariana Islands',

    //South America
    'Argentina',
    'Bolivia',
    'Brazil',
    'Chile',
    'Colombia',
    'Ecuador',
    'Peru',
    'Uruguay',
];

// 获取所有国家
export const getAllCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const allCountries = await response.json();

    // 过滤掉台湾
    const filteredCountries = allCountries.filter(
        (country) => country.name.common !== 'Taiwan'
    );

    return filteredCountries;
};

// 获取 Geoguessr 模式的国家列表
export const getGeoguessrCountries = async () => {
    const allCountries = await getAllCountries();
    return allCountries.filter((country) =>
        geoguessrCountries.includes(country.name.common)
    );
};
