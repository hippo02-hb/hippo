import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Movies API
export const moviesAPI = {
  getAll: (status = null) => {
    const params = status ? { status } : {};
    return apiClient.get('/movies/', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/movies/${id}`);
  },
  
  getShowing: () => {
    return apiClient.get('/movies/', { params: { status: 'showing' } });
  },
  
  getComing: () => {
    return apiClient.get('/movies/', { params: { status: 'coming' } });
  }
};

// Cinemas API
export const cinemasAPI = {
  getAll: (province = null) => {
    const params = province ? { province } : {};
    return apiClient.get('/cinemas/', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/cinemas/${id}`);
  },
  
  getScreens: (cinemaId) => {
    return apiClient.get(`/cinemas/${cinemaId}/screens`);
  }
};

// Showtimes API
export const showtimesAPI = {
  getAll: (filters = {}) => {
    return apiClient.get('/showtimes/', { params: filters });
  },
  
  getById: (id) => {
    return apiClient.get(`/showtimes/${id}`);
  },
  
  getAvailableDates: (movieId = null, cinemaId = null) => {
    const params = {};
    if (movieId) params.movie_id = movieId;
    if (cinemaId) params.cinema_id = cinemaId;
    return apiClient.get('/showtimes/dates/available', { params });
  },
  
  getAvailableTimes: (movieId, cinemaId, showDate) => {
    const params = {
      movie_id: movieId,
      cinema_id: cinemaId,
      show_date: showDate
    };
    return apiClient.get('/showtimes/times/available', { params });
  }
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => {
    return apiClient.post('/bookings/', bookingData);
  },
  
  getById: (id) => {
    return apiClient.get(`/bookings/${id}`);
  },
  
  getByCode: (code) => {
    return apiClient.get(`/bookings/code/${code}`);
  },
  
  getDetails: (id) => {
    return apiClient.get(`/bookings/${id}/details`);
  },
  
  cancel: (id) => {
    return apiClient.patch(`/bookings/${id}/cancel`);
  }
};

// News API
export const newsAPI = {
  getAll: (category = null) => {
    const params = category ? { category } : {};
    return apiClient.get('/news/', { params });
  },
  
  getById: (id) => {
    return apiClient.get(`/news/${id}`);
  },
  
  getPromotions: () => {
    return apiClient.get('/news/', { params: { category: 'promotion' } });
  },
  
  getNews: () => {
    return apiClient.get('/news/', { params: { category: 'news' } });
  }
};

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  return time.substring(0, 5); // Convert "10:00:00" to "10:00"
};

// Error handler for components
export const handleAPIError = (error, defaultMessage = 'Có lỗi xảy ra') => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  return error.message || defaultMessage;
};

export default apiClient;