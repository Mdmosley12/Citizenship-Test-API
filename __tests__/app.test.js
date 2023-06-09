const app = require("../app/index");
const request = require("supertest");
const { pool } = require("../dbConfig/connection");
const seed = require("../dbConfig/seed");
const testData = require("../dbConfig/testData/index");

beforeAll(() => {
  return seed(testData);
});

afterAll(() => {
  return pool.end();
});

describe("application testing", () => {
  describe("get endpoints", () => {
    test("Returns with all the endpoints available to the api", () => {
      return request(app)
        .get("/")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const parsedEndpoints = JSON.parse(endpoints);
          expect(parsedEndpoints).toEqual(
            expect.objectContaining({
              "GET /": expect.any(Object),
              "GET /questions": expect.any(Object),
              "GET /questions/:question_id": expect.any(Object),
              "GET /randomQuestions": expect.any(Object),
              "GET /answers": expect.any(Object),
              "GET /answers/:question_id": expect.any(Object),
            })
          );
        });
    });
  });
  describe("get questions", () => {
    test("Returns a 200 status code", () => {
      return request(app).get("/questions").expect(200);
    });
    test("Returns all questions", () => {
      return request(app)
        .get("/questions")
        .expect(200)
        .then(({ body: { questions } }) => {
          expect(questions.length).toBe(25);
        });
    });
    test("Returned questions contain all object keys", () => {
      return request(app)
        .get("/questions")
        .expect(200)
        .then(({ body: { questions } }) => {
          questions.forEach((question) => {
            expect(question).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                question_text: expect.any(String),
              })
            );
          });
        });
    });
    test("Returns a 404 status code and an error message when the entered path does not exist", () => {
      return request(app)
        .get("/notAPath")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found!");
        });
    });
  });
  describe("get question by id", () => {
    test("Returns a 200 status code", () => {
      return request(app).get("/questions/1").expect(200);
    });
    test("Returns the requested question", () => {
      return request(app)
        .get("/questions/2")
        .expect(200)
        .then(({ body: { question } }) => {
          expect(question[0].id).toBe(2);
        });
    });
    test("Returned question contains all object keys", () => {
      return request(app)
        .get("/questions/3")
        .expect(200)
        .then(({ body: { question } }) => {
          question.forEach((question) => {
            expect(question).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                question_text: expect.any(String),
              })
            );
          });
        });
    });
    test("Returns a 404 status code and an error message when the requested question does not exist", () => {
      return request(app)
        .get("/questions/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Question Not Found!");
        });
    });
  });
  describe("get random questions", () => {
    test("Returns a 200 status code", () => {
      return request(app).get("/randomQuestions").expect(200);
    });
    test("Returns 24 questions", () => {
      return request(app)
        .get("/randomQuestions")
        .expect(200)
        .then(({ body: { questions } }) => {
          expect(questions.length).toBe(24);
        });
    });
    test("Returned question are in a random order", () => {
      return request(app)
        .get("/randomQuestions")
        .expect(200)
        .then(({ body: { questions } }) => {
          const response1 = questions;
          return request(app)
            .get("/randomQuestions")
            .then(({ body: { questions } }) => {
              const response2 = questions;
              expect(response1).not.toEqual(response2);
            });
        });
    });
    test("Returns a 404 status code and an error message when the entered path does not exist", () => {
      return request(app)
        .get("/randoooooomQuestions")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found!");
        });
    });
  });
  describe("get answers", () => {
    test("Returns a 200 status code", () => {
      return request(app).get("/answers").expect(200);
    });
    test("Returns all answers", () => {
      return request(app)
        .get("/answers")
        .expect(200)
        .then(({ body: { answers } }) => {
          expect(answers.length).toBe(75);
        });
    });
    test("Returned answers contain all object keys", () => {
      return request(app)
        .get("/answers")
        .expect(200)
        .then(({ body: { answers } }) => {
          answers.forEach((answer) => {
            expect(answer).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                question_id: expect.any(Number),
                answer_text: expect.any(String),
                is_correct: expect.any(Number),
              })
            );
          });
        });
    });
    test("Returns a 404 status code and an error message when the entered path does not exist", () => {
      return request(app)
        .get("/answersssss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path Not Found!");
        });
    });
  });
  describe("get answers by question id", () => {
    test("Returns a 200 status code", () => {
      return request(app).get("/answers/1").expect(200);
    });
    test("Returns all questions related to given question id", () => {
      return request(app)
        .get("/answers/2")
        .expect(200)
        .then(({ body: { answers } }) => {
          expect(answers.length).toBe(3);
        });
    });
    test("Returned answers contain all object keys", () => {
      return request(app)
        .get("/answers/3")
        .expect(200)
        .then(({ body: { answers } }) => {
          answers.forEach((answer) => {
            expect(answer).toEqual(
              expect.objectContaining({
                id: expect.any(Number),
                question_id: expect.any(Number),
                answer_text: expect.any(String),
                is_correct: expect.any(Number),
              })
            );
          });
        });
    });
    test("Returns a 404 status code and an error message when the requested question does not exist", () => {
      return request(app)
        .get("/answers/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Question Not Found!");
        });
    });
  });
});
