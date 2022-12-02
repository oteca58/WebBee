const request = require("supertest");
const app = require("../app");
const connectDB = require("../server").connectDB;
const disconnectDB = require("../server").disconnectDB;

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

    it("login method_status", async () => {
      let user = {
        email: "beeadopter@webBee.it",
        password: "beeadopter",
      };
      let result = request(app).post("/api/v1/users/login").send(user);

      const res = await result;
      expect(res.status).toBe(200);
    });
    describe("logout", () => {
      it(" method_status", async () => {
        let result = request(app).post("/api/v1/users/logout").send();

        const res = await result;
        expect(res.status).toBe(200);
      });
    });

    it(" method_message", async () => {
      let result = request(app).post("/api/v1/users/logout").send();

      const res = await result;
      expect(res.body).toStrictEqual({ message: "Successfully logged out" });
    });
  });
  it(" method_cookies", async () => {
    let result = request(app).post("/api/v1/users/logout").send();

    const res = await result;
    expect(res.cookies).toBeUndefined();
  });
});

it("redirection test", async () => {
  let result = request(app).post("/api/v1/users/logout").send();
  const expected = ["jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"];
  const res = await result;
  console.log(res.header["set-cookie"]);
  expect(["jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"]).toEqual(
    expect.arrayContaining(expected)
  );
});
