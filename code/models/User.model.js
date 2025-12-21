export default class User {
  #id;

  constructor({ id, username, email, goal, height_cm, sexe }) {
    this.#id = id;
    this.username = username;
    this.email = email;
    this.goal = goal;
    this.height_cm = height_cm;
    this.sexe = sexe;
  }

  get id() {
    return this.#id;
  }
}