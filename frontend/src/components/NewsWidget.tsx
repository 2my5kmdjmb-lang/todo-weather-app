import React, { useState } from 'react';
import { useNews } from '../hooks/useNews';

const NewsWidget: React.FC = () => {
  const { articles, loading, error, searchQuery, searchNews, loadRecommendedNews } = useNews();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      searchNews(input.value.trim());
      setShowSearch(false);
    }
  };

  const handleShowRecommended = () => {
    loadRecommendedNews();
    setShowSearch(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="news-widget">
        <div className="news-loading">
          正在加载新闻...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-widget">
        <div className="news-error">
          {error}
          <br />
          <button 
            onClick={loadRecommendedNews}
            className="retry-button"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-widget">
      <div className="news-header">
        <h2>新闻资讯</h2>
        <div className="news-actions">
          <button 
            className="news-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="搜索新闻"
          >
            🔍 搜索
          </button>
          <button 
            className="news-btn"
            onClick={handleShowRecommended}
            title="推荐新闻"
          >
            📰 推荐
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="search-indicator">
          搜索结果: "{searchQuery}"
        </div>
      )}

      {showSearch && (
        <form className="news-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="news-search-input"
            placeholder="输入关键词搜索新闻..."
            autoFocus
            maxLength={50}
          />
          <button type="submit" className="news-search-btn">
            搜索
          </button>
        </form>
      )}

      <div className="news-grid">
        {articles.slice(0, 4).map(article => (
          <div key={article.id} className="news-card">
            <div className="news-card-content">
              <div className="news-card-meta">
                <span className="news-card-source">{article.source}</span>
                <span className="news-card-time">{formatDate(article.publishedAt)}</span>
              </div>
              <h3 className="news-card-title">{article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title}</h3>
              <p className="news-card-summary">{article.summary.length > 60 ? article.summary.substring(0, 60) + '...' : article.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && !loading && (
        <div className="news-empty">
          暂无新闻数据
        </div>
      )}
    </div>
  );
};

export default NewsWidget;