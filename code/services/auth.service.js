import { loginUser, signupUser } from "./martha.service";

class AuthService {
  user = null;

  async login(email, password) {
    const u = await loginUser(email, password);
    if (!u) return false;

    this.user = u;
    return true;
  }

  async signup(email, password) {
    const u = await signupUser(email, password);
    this.user = u;
    return true;
  }

  logout() {
    this.user = null;
  }

  currentUser() {
    return this.user;
  }
}

export default new AuthService();
