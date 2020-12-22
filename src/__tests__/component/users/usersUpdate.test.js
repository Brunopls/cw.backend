const request = require("supertest");
const faker = require("faker");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Roles = require("../../../models/rolesModel");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentUpdatePermissions", () => {
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

  test("agentUpdateOwnTrue", async () => {
    let result;
    const newName = faker.name.findName();

    await request(app.callback())
      .put(`/api/users/${user._id}`)
      .send({fullName:faker.name.findName()})
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(204);
  });

  test("agentUpdateAnyFalse", async () => {
    let result;
    role = await Roles.getOneByTitle("admin");
    user = await Users.getOneByRole(role._id);

    await request(app.callback())
      .put(`/api/users/${user._id}`)
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

describe("adminUpdatePermissions", () => {
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

  test("adminUpdateAnyTrue", async () => {
    let result;
    role = await Roles.getOneByTitle("agent");
    user = await Users.getOneByRole(role._id);

    await request(app.callback())
      .put(`/api/users/${user._id}`)
      .send({fullName:faker.name.findName()})
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(204);
  });
});

describe("generalPublicUpdatePermissions", () => {
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
    app.destroy();
  });

  test("generalPublicUpdateAnyFalse", async () => {
    let result;

    await request(app.callback())
      .put(`/api/users/${user._id}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(401);
  });
});
