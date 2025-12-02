import User from "../models/User.model";
import { loginUser, signupUser, updateProfile } from "./martha.service";

class AuthService {
  user = null;

  async login(credentials) {
    const res = await loginUser(credentials.email, credentials.password);

    if (res.data.length === 1) {
      this.user = new User(res.data[0]);
      return true;
    }

    this.user = null;
    return false;
  }

  async signup(credentials) {
    const res = await signupUser(
      credentials.email,
      credentials.password,
      credentials.username
    );

    if (!res.success || !res.lastInsertId) return false;

    this.user = new User({
      id: res.lastInsertId,
      username: credentials.username,
      email: credentials.email
    });

    return true;
  }

  async updateProfile(values) {
    const res = await updateProfile(values);
    if (!res.success) return false;

    this.user = new User({ ...this.user, ...values });
    return true;
  }

  logout() {
    this.user = null;
  }

  get currentUser() {
    return this.user;
  }
}

export default new AuthService();
