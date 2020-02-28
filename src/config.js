const urls = {
  "development": "127.0.0.1:8000/",
  "production": "hellofamily.club/",
};

export const URL = urls[process.env.NODE_ENV];
