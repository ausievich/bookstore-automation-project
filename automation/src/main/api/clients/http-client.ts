import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Environment } from '@automation/main/common/config/environment';

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string = Environment.apiUrl) {
    this.client = axios.create({
      baseURL,
      validateStatus: () => true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common.Authorization;
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<{ status: number; data: T }> {
    const response = await this.client.request<T>(config);
    return { status: response.status, data: response.data };
  }
}
