const request = require("supertest");
const faker = require("faker");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Roles = require("../../../models/rolesModel");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentReadPermissions", () => {
  let token;
  let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle("agent");
      user = await Users.getOneByRole(role._id);
      return await request(app.callback())
        .post("/api/users/login")
        .auth(user.email, "passw0rd")
        .then((res) => {
          token = res.body.token;
        });
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await app.destroy();
  });

  test("agentReadAllFalse", async () => {
    let result;

    await request(app.callback())
      .get("/api/users")
      .auth(user.email, "passw0rd")
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(403);
  });

  test("agentReadOwnTrue", async () => {
    let result;

    await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(200);
  });

  test("agentReadOneFalse", async () => {
    let result;
    role = await Roles.getOneByTitle("admin");
    user = await Users.getOneByRole(role._id);

    await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(403);
  });
});

describe("adminReadPermissions", () => {
  let token;
  let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle("admin");
      user = await Users.getOneByRole(role._id);
      return await request(app.callback())
        .post("/api/users/login")
        .auth(user.email, "passw0rd")
        .then((res) => {
          token = res.body.token;
        });
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await app.destroy();
  });

  test("adminReadAllTrue", async () => {
    let result;

    await request(app.callback())
      .get("/api/users")
      .auth(user.email, "passw0rd")
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(200);
  });

  test("adminReadOneTrue", async () => {
    let result;
    role = await Roles.getOneByTitle("agent");
    user = await Users.getOneByRole(role._id);

    await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(200);
  });
});

describe("generalPublicReadPermissions", () => {
  let token;
  let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle("admin");
      user = await Users.getOneByRole(role._id);
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  });

  test("generalPublicReadAllFalse", async () => {
    let result;

    await request(app.callback())
      .get("/api/users")
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(401);
  });

  test("generalPublicReadOneFalse", async () => {
    let result;

    await request(app.callback())
      .get(`/api/users/${user._id}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(401);
  });
});
