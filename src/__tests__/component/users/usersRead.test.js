const request = require('supertest')
const app = require('../../../../app')
const Users = require("../../../models/usersModel")
const Roles = require("../../../models/rolesModel")

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT 
describe("agentReadPermissions", () => {
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

  test("agentReadAllFalse", async () => {
    return await request(app.callback())
      .get('/api/users')
      .auth(user.email, 'passw0rd')
      .then((response) => {
        expect(response.statusCode).toEqual(403)
      })
      .catch((err) => {
        console.log(err)
      })
  });

  test("agentReadOwnTrue", async () => {
    return await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(200)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  test("agentReadOneFalse", async () => {
    role = await Roles.getOneByTitle('admin');
    user = await Users.getOneByRole(role._id);
    return await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(403)
      })
      .catch((err) => {
        console.log(err)
      })
  })
})

describe("adminReadPermissions", () => {
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

  test("adminReadAllTrue", async () => {
    return await request(app.callback())
      .get('/api/users')
      .auth(user.email, 'passw0rd')
      .then((response) => {
        expect(response.statusCode).toEqual(200)
      })
      .catch((err) => {
        console.log(err)
      })
  });

  test("adminReadOneTrue", async () => {
    role = await Roles.getOneByTitle('agent');
    user = await Users.getOneByRole(role._id);
    return await request(app.callback())
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(200)
      })
      .catch((err) => {
        console.log(err)
      })
  })
})

describe("generalPublicReadPermissions", () => {
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
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  })

  test("generalPublicReadAllFalse", async () => {
    return await request(app.callback())
      .get('/api/users')
      .then((response) => {
        expect(response.statusCode).toEqual(401)
      })
      .catch((err) => {
        console.log(err)
      })
  });

  test("generalPublicReadOneFalse", async () => {
    return await request(app.callback())
      .get(`/api/users/${user._id}`)
      .then((response) => {
        expect(response.statusCode).toEqual(401)
      })
      .catch((err) => {
        console.log(err)
      })
  })
})