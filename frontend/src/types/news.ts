export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  imageUrl?: string;
}

export interface NewsService {
  searchNews(query: string): Promise<NewsArticle[]>;
  getRecommendedNews(): Promise<NewsArticle[]>;
}