import { useState, useEffect } from 'react';
import type { NewsArticle } from '../types/news';
import { newsService } from '../services/newsService';

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取推荐新闻
  const loadRecommendedNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const news = await newsService.getRecommendedNews();
      setArticles(news);
      setSearchQuery('');
    } catch (err) {
      setError('获取推荐新闻失败');
      console.error('Error loading recommended news:', err);
    } finally {
      setLoading(false);
    }
  };

  // 搜索新闻
  const searchNews = async (query: string) => {
    if (!query.trim()) {
      loadRecommendedNews();
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      const news = await newsService.searchNews(query);
      setArticles(news);
    } catch (err) {
      setError('搜索新闻失败');
      console.error('Error searching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载推荐新闻
  useEffect(() => {
    loadRecommendedNews();
  }, []);

  return {
    articles,
    loading,
    error,
    searchQuery,
    searchNews,
    loadRecommendedNews
  };
};