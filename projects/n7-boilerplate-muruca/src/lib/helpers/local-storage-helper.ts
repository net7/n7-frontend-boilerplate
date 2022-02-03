export default {
  set(key: string, value: any): void {
    localStorage.setItem(key, value);
  },
  get(key: string): any {
    return localStorage.getItem(key);
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  toggle(key: string, value: any): void {
    if (!this.get(key)) {
      this.set(key, value);
    } else {
      this.remove(key);
    }
  }
};
