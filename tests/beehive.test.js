const request = require("supertest");
const app = require("../app");
const connectDB = require("../server").connectDB;
const disconnectDB = require("../server").disconnectDB;
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

describe("API test", () => {
  let con;
  let mongoServer;

  beforeAll(async () => {

    // await connectDB()
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {});
  });

  afterAll(async () => {
    
    if (con) {
      await con.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("create user", async () => {
     
    const db = con.db(mongoServer.db);
    let user = {
      name: "beekeeper",
      email: "beekeeper@webBee.it",
      password: "beekeeper",
      passwordConfirm: "beekeeper",
      role: "beekeeper",
    };
    let beehive = {
              serial_beehive: 5,
              place: "Genova",
              state: "fever",
              honeycomb: 1,
              pollin_trap: "false",
              propolis_net: "false",
              price: 7.9
            }
            
    // let result = request(app).post("/api/v1/users/signup").send(user);
    const col = db.collection("webbee");
    const result = await col.insertOne(user);
    let userr = {
          email: "beekeeper@webBee.it",
          password: "beekeeper",
        };
        let result12 = request(app).post("/api/v1/users/login").send(userr);
    
    // const findUser = await col.findOne(user);
    // console.log( typeof user._id)
    let result1 = request(app).post(`/api/v1/bees/${user._id}/mybeehives`).send(beehive);
    // console.log(`/api/v1/bees/:${user._id}/mybeehives`)

    const res = await result1;
   expect(res.status).toBe(201);

    // expect(await col.countDocuments({})).toBe(1);
  })

  // it("signup method", async () => {
  //   let user = {
  //     name: "beekeeper",
  //     email: "beekeeper@webBee.it",
  //     password: "beekeeper",
  //     passwordConfirm: "beekeeper",
  //     role: "beekeeper",
  //   };
  //   let result = request(app).post("/api/v1/users/signup").send(user);

  //   const res = await result;
  //   // console.log(mongoServer)
  //   expect(res.status).toBe(201);
  // });

  // it("login method_status", async () => {
  //   let user = {
  //     email: "beekeeper@webBee.it",
  //     password: "beekeeper",
  //   };
  //   let result = request(app).post("/api/v1/users/login").send(user);

  //   const res = await result;
  //   expect(res.status).toBe(200);
  // });
  // it("create beehive", async () => {
  //     let beehive = {
  //         serial_beehive: 5,
  //         place: "Genova",
  //         state: "fever",
  //         honeycomb: 1,
  //         pollin_trap: "false",
  //         propolis_net: "false",
  //         price: 7.9
  //       }
  // const users = db.collection('users');

  // const mockUser = {_id: 'some-user-id', name: 'John'};
  // await users.insertOne(mockUser);

  // const insertedUser = await users.findOne({_id: 'some-user-id'});
  // expect(insertedUser).toEqual(mockUser);
  // const db = await connectDB()
  // 'dbName',db._instanceInfo.dbName
  //  db._instanceInfo.dbName = 'databaseName'
  // const currentUser = await User.find({place: "Genova"})
  // console.log(con.connectDB)
  // const userId = user_id
  // let result = request(app).post(`/api/v1/bees/:${userId}/mybeehives`).send(beehive);
  //     // var user = db.users.findOne({userName:"And"})

  //     // const res = await result;
  //     expect(res.status).toBe(201);
});
//     it("logout method_status", async () => {

//       let result = request(app).post("/api/v1/users/logout").send();

//       const res = await result;
//       expect(res.status).toBe(200);
//     });
//   });

//     it("logout method_message", async () => {

//       let result = request(app).post("/api/v1/users/logout").send();

//       const res = await result;
//       expect(res.body).toStrictEqual({ "message": "Successfully logged out" });
//     });

//   });
//    it("logout method_cookies", async () => {

//     let result = request(app).post("/api/v1/users/logout").send();

//     const res = await result;
//     expect(res.cookies).toBeUndefined();
//   });

//   it('redirection test', async () => {
//     let result = request(app).post("/api/v1/users/logout").send();
//     const expected = [ 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' ]
//     const res = await result;
//     console.log(res.header['set-cookie'])
//     expect([ 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' ]).toEqual(expect.arrayContaining(expected));
// });
