import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-70d9165f`;

export class ApiService {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth
  async signup(email: string, password: string, name: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // User Preferences
  async getPreferences() {
    return this.request('/user/preferences');
  }

  async savePreferences(preferences: any) {
    return this.request('/user/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async saveCart(cart: any[]) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ cart }),
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async saveWishlist(wishlist: any[]) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ wishlist }),
    });
  }

  // Orders
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async saveNotifications(notifications: any[]) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify({ notifications }),
    });
  }

  // Subscriptions
  async getSubscriptions() {
    return this.request('/subscriptions');
  }

  async saveSubscriptions(subscriptions: any[]) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ subscriptions }),
    });
  }

  // Rewards
  async getRewards() {
    return this.request('/rewards');
  }

  async saveRewards(rewards: any) {
    return this.request('/rewards', {
      method: 'POST',
      body: JSON.stringify(rewards),
    });
  }

  // Search History
  async getSearches() {
    return this.request('/searches');
  }

  async saveSearches(searches: string[]) {
    return this.request('/searches', {
      method: 'POST',
      body: JSON.stringify({ searches }),
    });
  }
}

export const api = new ApiService();
