//const supertest = require("supertest");
const { agent } = require("supertest");
//const app = require("./../app");
const { createHttpserver, connectDB, disconnectDB } = require("./../server");
const httpServer = createHttpserver(3000);
const request = agent(httpServer);

describe("API test", () => {
  beforeAll(() => {
    connectDB();
  });

  afterAll(() => {
    disconnectDB();
    httpServer.close();
  });

  describe("POST /api/v1/users", () => {
    it("example request using a mocked database instance", async () => {
      let url = request.get("/api/v1/users/signup");
      console.log(url.url);
      const res = await request.post("/api/v1/users/signup", {
        name: "beeadopter",
        email: "beeadopter@webBee.it",
        password: "beeadopter",
        passwordConfirm: "beeadopter",
        role: "beeadopter",
      });
      //jest.setTimeout(10000);
      expect(res.status).toBe(201);
    });
  });
});
