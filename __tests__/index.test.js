const app = require("../MVC/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endPoints = require("../endpoints.json");

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
        expect(body.endPoints).toEqual(endPoints);
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

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an article object", () => {
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(typeof body.article.author).toBe("string");
          expect(typeof body.article.title).toBe("string");
          expect(typeof body.article.article_id).toBe("number");
          expect(typeof body.article.body).toBe("string");
          expect(typeof body.article.topic).toBe("string");
          expect(typeof body.article.created_at).toBe("string");
          expect(typeof body.article.votes).toBe("number");
          expect(typeof body.article.article_img_url).toBe("string");
      });
  });

  //Error handling
  test("status 404: responds with error message when given a wrong URL", () => {
      return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
      });
  });

  test("status 400: responds with error message when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/invalid")
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
    });
});

});

describe("GET /api/articles", () => {
  test("status 200: responds with an array of article objects", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("string");
          });
      });
  });

  //Error handling
  test("status 404: responds with error message when given a wrong URL", () => {
      return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
      });
  });
});

