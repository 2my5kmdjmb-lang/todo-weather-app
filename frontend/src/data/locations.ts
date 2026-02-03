// 地区数据
export interface LocationData {
  country: string;
  cities: string[];
}

export const locationData: LocationData[] = [
  {
    country: '中国',
    cities: ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉', '南京', '重庆', '天津', '苏州', '长沙', '郑州', '青岛', '大连', '宁波', '厦门']
  },
  {
    country: '美国',
    cities: ['纽约', '洛杉矶', '芝加哥', '休斯顿', '费城', '凤凰城', '圣安东尼奥', '圣地亚哥', '达拉斯', '圣何塞']
  },
  {
    country: '日本',
    cities: ['东京', '大阪', '横滨', '名古屋', '札幌', '神户', '京都', '福冈', '川崎', '埼玉']
  },
  {
    country: '英国',
    cities: ['伦敦', '伯明翰', '利兹', '格拉斯哥', '谢菲尔德', '布拉德福德', '爱丁堡', '利物浦', '曼彻斯特']
  },
  {
    country: '法国',
    cities: ['巴黎', '马赛', '里昂', '图卢兹', '尼斯', '南特', '斯特拉斯堡', '蒙彼利埃', '波尔多']
  },
  {
    country: '德国',
    cities: ['柏林', '汉堡', '慕尼黑', '科隆', '法兰克福', '斯图加特', '杜塞尔多夫', '多特蒙德', '埃森']
  },
  {
    country: '澳大利亚',
    cities: ['悉尼', '墨尔本', '布里斯班', '珀斯', '阿德莱德', '黄金海岸', '纽卡斯尔', '堪培拉', '卧龙岗']
  },
  {
    country: '加拿大',
    cities: ['多伦多', '蒙特利尔', '温哥华', '卡尔加里', '埃德蒙顿', '渥太华', '魁北克市', '温尼伯', '哈密尔顿']
  }
];

export const getAllCities = (): string[] => {
  return locationData.flatMap(location => location.cities);
};

export const getCitiesByCountry = (country: string): string[] => {
  const location = locationData.find(loc => loc.country === country);
  return location ? location.cities : [];
};

export const getCountries = (): string[] => {
  return locationData.map(location => location.country);
};