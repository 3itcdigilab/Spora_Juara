type Handler = (payload: any) => void;
class EventBus {
  private listeners: Record<string, Handler[]> = {};
  on(event: string, handler: Handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }
  emit(event: string, payload?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(h => h(payload));
    }
  }
  off(event: string, handler: Handler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }
  }
}
export const eventBus = new EventBus();