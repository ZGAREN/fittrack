import { Capacitor } from '@capacitor/core';

/**
 * Web (browser + PWA): relative `/api`, proxied to the backend by the Angular
 * dev server (proxy.conf.json) or by nginx in the Docker/prod setup.
 * Native (iOS/Android via Capacitor): no dev-server proxy exists, so the app
 * must reach the backend over the network directly. Point this at your
 * machine's LAN IP for device testing, or the deployed backend URL for prod.
 */
const NATIVE_API_BASE_URL = 'http://192.168.1.10:8080/api';

export const API_BASE_URL = Capacitor.isNativePlatform() ? NATIVE_API_BASE_URL : '/api';
