// 类型定义
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  timestamp: Date;
}

export interface WeatherService {
  getCurrentWeather(): Promise<WeatherData>;
  getCurrentPosition(): Promise<GeolocationPosition>;
  searchWeatherByCity(cityName: string): Promise<WeatherData>;
  getWeatherByLocation(country: string, city: string): Promise<WeatherData>;
  getWeatherByGeolocation(): Promise<WeatherData>;
}

export interface TaskService {
  createTask(text: string): Task | null;
  toggleTask(taskId: string): Task | null;
  deleteTask(taskId: string): boolean;
  getAllTasks(): Task[];
  updateTaskText(taskId: string, text: string): Task | null;
}

export interface StorageService {
  saveTasks(tasks: Task[]): void;
  loadTasks(): Task[];
  clearTasks(): void;
}
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