const request = require("supertest");
const app = require("./../app");
const connectDB = require("./../server").connectDB;
const disconnectDB = require("./../server").disconnectDB;

describe("API test", () => {
  beforeAll(() => {
    connectDB();
  });

  afterAll(() => {
    disconnectDB();
  });

  describe("signup and login", () => {
    it("signup method", async () => {
      let user = {
        name: "beeadopter",
        email: "beeadopter@webBee.it",
        password: "beeadopter",
        passwordConfirm: "beeadopter",
        role: "beeadopter",
      };
      let result = request(app).post("/api/v1/users/signup").send(user);

      const res = await result;
      expect(res.status).toBe(201);
    });

    it("login method", async () => {
      let user = {
        email: "beeadopter@webBee.it",
        password: "beeadopter",
      };
      let result = request(app).post("/api/v1/users/login").send(user);

      const res = await result;
      expect(res.status).toBe(200);
    });
    it("logout method", async () => {
    
      let result = request(app).post("/api/v1/users/logout").send();

      const res = await result;
      expect(res.status).toBe(200);
    });
  });

    it("logout method", async () => {
     
      let result = request(app).post("/api/v1/users/logout").send();

      const res = await result;
      console.log(res.json)
      expect(res.body).toStrictEqual({ "message": "Successfully logged out" });
    });
  });

