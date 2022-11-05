const supertest = require("supertest");
const app = require("./../app");
const { server } = require("./../server");
const request = supertest(app);

const { connectDB, disconnectDB } = require("./mockDB");

describe("API test", () => {
  beforeAll(() => {
    connectDB();
  });

  afterAll(() => {
    disconnectDB();
    server.close();
  });
  describe("POST /api/v1/users", () => {
    it("example request using a mocked database instance", async () => {
      const res = await request.post("/api/v1/users/signup", {
        name: "beeadopter",
        email: "beeadopter@webBee.it",
        password: "beeadopter",
        passwordConfirm: "beeadopter",
        role: "beeadopter",
      });
      jest.setTimeout(10000);
      expect(res.status).toBe(201);
    });
  });
});
