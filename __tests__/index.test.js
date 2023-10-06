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

  test("status 200: responds with an article object with a comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe("11");
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
        expect(body.articles.length).toBe(10);
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

  test("status 200: responds with an array of article objects sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("status 200: responds with an array of article objects filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("status 200: responds with an array of article objects sorted by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("status 200: responds with an array of article objects sorted by any valid column in any valid order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { ascending: true });
      });
  });

  test("status 200: responds with a an empty array when given a topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
      });
  });

  test("status 200: responds with different articles when given a page number", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
        expect(body.articles[0].article_id).toBe(8);
      });
  });

  test("status 200: responds with an empty array when given a page number that is too high", () => {
    return request(app)
      .get("/api/articles?p=100")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
      });
  });

  test("status 200: responds with a total_count property displaying the total  articles discounting the limit", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(13);
        expect(body.articles.length).toBe(10);
      });
  });

  test("status 200: responds with a amount of articles equal to the limit if the limit is less than the total count", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
        expect(body.total_count).toBe(13);
      });
  });

  //Error handling
  test("status 404: responds with error message when given an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });

  test("status 400: responds with error message when given an invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid limit", () => {
    return request(app)
      .get("/api/articles?limit=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid page number", () => {
    return request(app)
      .get("/api/articles?p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("status 201: responds with the posted article object", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "This is a test title",
        body: "This is a test body",
        topic: "mitch",
        author: "butter_bridge",
        article_img_url: "https://www.test.com/test.jpg",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article_id).toBe(14);
        expect(body.author).toBe("butter_bridge");
        expect(body.title).toBe("This is a test title");
        expect(body.body).toBe("This is a test body");
        expect(body.topic).toBe("mitch");
        expect(body.article_img_url).toBe("https://www.test.com/test.jpg");
        expect(body.votes).toBe(0);
        expect(body.created_at).not.toBe(undefined);
        expect(body.comment_count).toBe("0");
      });
  });

  test("status 201: responds with the posted article object ignoring any extra properties", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "This is a test title",
        body: "This is a test body",
        topic: "mitch",
        author: "butter_bridge",
        article_img_url: "https://www.test.com/test.jpg",
        extra: "extra",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article_id).toBe(14);
        expect(body.author).toBe("butter_bridge");
        expect(body.title).toBe("This is a test title");
        expect(body.body).toBe("This is a test body");
        expect(body.topic).toBe("mitch");
        expect(body.article_img_url).toBe("https://www.test.com/test.jpg");
        expect(body.votes).toBe(0);
        expect(body.created_at).not.toBe(undefined);
        expect(body.comment_count).toBe("0");
        expect(body.extra).toBe(undefined);
      });
  });

  test("status 201: responds with the posted article object with a default image when no image is given", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "This is a test title",
        body: "This is a test body",
        topic: "mitch",
        author: "butter_bridge",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article_id).toBe(14);
        expect(body.author).toBe("butter_bridge");
        expect(body.title).toBe("This is a test title");
        expect(body.body).toBe("This is a test body");
        expect(body.topic).toBe("mitch");
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(body.votes).toBe(0);
        expect(body.created_at).not.toBe(undefined);
        expect(body.comment_count).toBe("0");
      });
  });

  //Error handling
  test("status 400: responds with error message when no body is given", () => {
    return request(app)
      .post("/api/articles")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when missing a required property(author)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "This is a test title",
        body: "This is a test body",
        topic: "mitch",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
        expect(body.comments[0].article_id).toBe(1);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
        });
      });
  });

  test("status 200: responds with an array of comment objects sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("status 200: responds with a empty array when given an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });

  test("status 200: responds with a total_count property displaying the total  comments discounting the limit", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(11);
        expect(body.comments.length).toBe(10);
      });
  });

  test("status 200: responds with a amount of comments equal to the limit if the limit is less than the total count", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
        expect(body.total_count).toBe(11);
      });
  });

  test("status 200: responds with different comments when given a page number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(1);
        expect(body.comments[0].comment_id).toBe(9);
        expect(body.comments[0].article_id).toBe(1);
        expect(body.total_count).toBe(11);
      });
  });

  //Error handling
  test("status 404: responds with error message when the given article_id does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("status 400: responds with error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid page number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: responds with the posted comment object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "This is a test comment" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment_id).toBe(19);
        expect(body.author).toBe("butter_bridge");
        expect(body.article_id).toBe(1);
        expect(body.body).toBe("This is a test comment");
      });
  });

  test("status 201: responds with the posted comment object ignoring any extra properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is a test comment",
        extra: "extra",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment_id).toBe(19);
        expect(body.author).toBe("butter_bridge");
        expect(body.article_id).toBe(1);
        expect(body.body).toBe("This is a test comment");
      });
  });

  //Error handling
  test("status 404: responds with error message when the given article_id does not exist", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({ username: "butter_bridge", body: "This is a test comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("status 400: responds with error message when given an invalid article_id", () => {
    return request(app)
      .post("/api/articles/invalid/comments")
      .send({ username: "butter_bridge", body: "This is a test comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when no body is given", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given non-existent username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "invalid", body: "This is a test comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: responds with the updated article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(101);
      });
  });

  //Error handling
  test("status 404: responds with error message when the given article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("status 400: responds with error message when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/invalid")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status 400: responds with error message when given an invalid key for inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ invalid: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an empty body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  //Error handling
  test("status 404: responds with error message when the given comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test("status 400: responds with error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status 200: responds with the updated comment object", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(-99);
        expect(body.comment.comment_id).toBe(4);
      });
  });

  //Error handling
  test("status 404: responds with error message when the given comment_id does not exist", () => {
    return request(app)
      .patch("/api/comments/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test("status 400: responds with error message when given an invalid comment_id", () => {
    return request(app)
      .patch("/api/comments/invalid")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("status 400: responds with error message when given an invalid inc_votes", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("status 200: responds with a user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("butter_bridge");
        expect(typeof body.user.name).toBe("string");
        expect(typeof body.user.avatar_url).toBe("string");
      });
  });

  //Error handling
  test("status 404: responds with error message when the given username does not exist", () => {
    return request(app)
      .get("/api/users/invalid")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
});
