import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsDisplay = () => {
  const [newsData, setNewsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://linesnews.onrender.com/api/news-datas');
        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setNewsData(response.data.data);
          setFilteredData(response.data.data);
          const uniqueCategories = ['All', ...new Set(response.data.data.map(article => article.attributes.category))];
          setCategories(uniqueCategories);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, []);

  const filterByCategory = category => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredData(newsData);
    } else {
      const filteredArticles = newsData.filter(article => article.attributes.category === category);
      setFilteredData(filteredArticles);
    }
  };

  const handleSearch = () => {
    const searchResults = newsData.filter(article =>
      article.attributes.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(searchResults);
  };

  const handleInputChange = e => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="news-container">
     

      {/* Category filter  */}
      <div className="box">
        <select className="category-dropdown" value={selectedCategory} onChange={(e) => filterByCategory(e.target.value)}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Search box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by categories..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleSearch}   className="search-button">Search</button>
      </div>

      {/* News list */}
      <ul className='news-list'>
        {filteredData.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          filteredData.map((article) => (
            <li key={article.id} className='news-card'>
              <div className='content'>
                <h2>{article.attributes.headline}</h2>
                <p>Source: {article.attributes.newsSource}</p>
                <p>Hashtags: {article.attributes.hashtags}</p>
              </div>
              <img src={article.attributes.newsIcon} alt="News Icon" />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NewsDisplay;
