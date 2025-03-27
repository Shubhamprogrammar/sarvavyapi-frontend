import React, { useState, useEffect, useCallback } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = ({ country = 'us', pageSize = 9, category = 'business', apiKey }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // Fetch news data
  const fetchNews = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${pageNumber}&pageSize=${pageSize}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const parsedData = await response.json();

      // Safeguard against missing or malformed data
      const fetchedArticles = parsedData.articles || [];
      const fetchedTotalResults = parsedData.totalResults || 0;

      setArticles((prevArticles) =>
        pageNumber === 1 ? fetchedArticles : prevArticles.concat(fetchedArticles)
      );
      setTotalResults(fetchedTotalResults);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [country, category, apiKey, pageSize]);

  // Fetch more data for InfiniteScroll
  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  // Update the document title and fetch initial data on component mount
  useEffect(() => {
    document.title = `Business Blogs - ${capitalizeFirstLetter(category)}`;
    fetchNews();
  }, [category, fetchNews]);

  return (
    <>
      <h1 className="text-center mt-3">
        Business Blogs
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles?.length || 0} // Handle case where articles might be undefined
        next={fetchMoreData}
        hasMore={articles?.length < totalResults} // Handle case where articles might be undefined
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles?.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) + '...' : ''}
                  description={element.description ? element.description.slice(0, 88) + '...' : ''}
                  imageurl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
};

export default News;
