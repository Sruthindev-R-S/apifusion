/**
 * @fileoverview A simple in-memory cache service.
 */

const cache = new Map();

class MemoryCache {
  get(key) {
    const entry = cache.get(key);
    if (entry && Date.now() < entry.expiry) {
      return entry.value;
    }
    cache.delete(key);
    return null;
  }

  set(key, value, ttlSeconds) {
    const expiry = Date.now() + ttlSeconds * 1000;
    cache.set(key, { value, expiry });
  }
}

module.exports = new MemoryCache();
