const request = require('supertest')
const faker = require('faker');
const app = require('../../../../app')
const Users = require("../../../models/usersModel")
const Roles = require("../../../models/rolesModel")

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT 
describe("agentUpdatePermissions", () => {
  let token; let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle('agent');
      user = await Users.getOneByRole(role._id);
      return await request(app.callback())
        .post('/api/users/login')
        .auth(user.email, 'passw0rd')
        .then((res) => {
          token = res.body.token
        })
    } catch (err) {
      console.log(err);
    }
  })

  afterAll(async () => {
    await app.destroy();
  })

  test("agentUpdateOwnTrue", async () => {
    const newName = faker.name.findName();
    user.fullName = newName;
    return await request(app.callback())
      .put(`/api/users/${user._id}`)
      .send(user)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  test("agentUpdateAnyFalse", async () => {
    role = await Roles.getOneByTitle('admin');
    user = await Users.getOneByRole(role._id);
    return await request(app.callback())
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(403)
      })
      .catch((err) => {
        console.log(err)
      })
  })
})

describe("adminUpdatePermissions", () => {
  let token; let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle('admin');
      user = await Users.getOneByRole(role._id);
      return await request(app.callback())
        .post('/api/users/login')
        .auth(user.email, 'passw0rd')
        .then((res) => {
          token = res.body.token
        })
    } catch (err) {
      console.log(err);
    }
  })

  afterAll(async () => {
    await app.destroy();
  })

  test("adminUpdateAnyTrue", async () => {
    role = await Roles.getOneByTitle('agent');
    user = await Users.getOneByRole(role._id);
    const newName = faker.name.findName();
    user.fullName = newName;
    
    return await request(app.callback())
      .put(`/api/users/${user._id}`)
      .send(user)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
      .catch((err) => {
        console.log(err)
      })
  });
})

describe("generalPublicUpdatePermissions", () => {
  let token; let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle('admin');
      user = await Users.getOneByRole(role._id);
    } catch (err) {
      console.log(err);
    }
  })

  afterAll(async () => {
    app.destroy();
  })

  test("generalPublicUpdateAnyFalse", async () => {
    return await request(app.callback())
      .put(`/api/users/${user._id}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401)
      })
      .catch((err) => {
        console.log(err)
      })
  });
})