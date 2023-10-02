const app = require("../MVC/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string"),
            expect(typeof topic.description).toBe("string");
        });
      });
  });

  //Error handling
  test("status 404: responds with error message when given a wrong URL", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("URL not found");
      });
  });
});

describe("GET /api", () => {
  test("status 200: responds with an object containing all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (let key in body.endpoints) {
          expect(typeof body.endpoints[key].description).toBe("string");
          expect(typeof body.endpoints[key].exampleResponse).toBe("object");
          expect(Array.isArray(body.endpoints[key].queries)).toBe(true);
          for(let i = 0; i < body.endpoints[key].exampleResponse.topics.length; i++) {
            expect(
              typeof body.endpoints[key].exampleResponse.topics[i].slug
            ).toBe("string");
            expect(
              typeof body.endpoints[key].exampleResponse.topics[i].description
            ).toBe("string");
          }
        }
      });
  });

  //Error handling
  test("status 404: responds with error message when given a wrong URL", () => {
    return request(app)
      .get("/apii")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("URL not found");
      });
  });
});
