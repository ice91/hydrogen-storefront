// app/lib/server/session.server.ts

import { createCookieSessionStorage, type SessionStorage, type Session } from "@shopify/remix-oxygen";

/**
 * 自定义会话实现
 */
export class AppSession {
  public isPending = false;
  #sessionStorage: SessionStorage;
  #session: Session;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  /**
   * 初始化会话
   */
  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: "session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets,
        secure: process.env.NODE_ENV === "production",
      },
    });

    const session = await storage.getSession(request.headers.get("Cookie")).catch(() => storage.getSession());
    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    this.isPending = true;
    return this.#session.unset;
  }

  get set() {
    this.isPending = true;
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}
