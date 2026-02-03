import type { NewsArticle, NewsService } from '../types/news';

export class MockNewsService implements NewsService {
  private mockArticles: NewsArticle[] = [
    {
      id: 'news-1',
      title: '科技创新推动数字化转型',
      summary: '最新研究显示，人工智能和机器学习技术正在各行各业中发挥重要作用，推动企业数字化转型进程。',
      url: '#',
      publishedAt: '2024-02-03T10:30:00Z',
      source: '科技日报',
      category: '科技',
      imageUrl: 'https://via.placeholder.com/300x200?text=科技新闻'
    },
    {
      id: 'news-2',
      title: '全球气候变化应对措施',
      summary: '联合国气候变化大会达成新协议，各国承诺加大减排力度，共同应对全球气候变化挑战。',
      url: '#',
      publishedAt: '2024-02-03T09:15:00Z',
      source: '环球时报',
      category: '环境',
      imageUrl: 'https://via.placeholder.com/300x200?text=环境新闻'
    },
    {
      id: 'news-3',
      title: '经济复苏势头良好',
      summary: '最新经济数据显示，多个主要经济体呈现复苏态势，消费者信心指数持续上升。',
      url: '#',
      publishedAt: '2024-02-03T08:45:00Z',
      source: '财经周刊',
      category: '经济',
      imageUrl: 'https://via.placeholder.com/300x200?text=经济新闻'
    },
    {
      id: 'news-4',
      title: '教育改革新政策发布',
      summary: '教育部发布新的教育改革政策，重点关注素质教育和创新能力培养。',
      url: '#',
      publishedAt: '2024-02-03T07:20:00Z',
      source: '教育报',
      category: '教育',
      imageUrl: 'https://via.placeholder.com/300x200?text=教育新闻'
    },
    {
      id: 'news-5',
      title: '健康生活方式推广',
      summary: '专家建议采用健康的生活方式，包括合理饮食、适量运动和充足睡眠。',
      url: '#',
      publishedAt: '2024-02-03T06:00:00Z',
      source: '健康时报',
      category: '健康',
      imageUrl: 'https://via.placeholder.com/300x200?text=健康新闻'
    }
  ];

  async searchNews(query: string): Promise<NewsArticle[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟搜索结果
    const filtered = this.mockArticles.filter(article => 
      article.title.includes(query) || 
      article.summary.includes(query) ||
      article.category.includes(query)
    );
    
    return filtered.length > 0 ? filtered : this.mockArticles.slice(0, 3);
  }

  async getRecommendedNews(): Promise<NewsArticle[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 返回推荐新闻（随机排序）
    const shuffled = [...this.mockArticles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }
}

export const newsService = new MockNewsService();