const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/users/:id/posts")     ///{"error":"Resource Not Found"} not giving all the posts at once///
  .get((req, res, next) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts: paginatedPosts, links });
  })

  

  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
        comments: [{id: 1, text: "I have a great year!"}, {id: 2, text: "Excited to start my new career!"}, {id: 3, text: "I learned a lot and so happy to be part of Per Scholas"}]
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "update",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "delete",
        type: "DELETE",
      },
      {
        href: `/${req.params.id}/comments`,
        rel: "comments",
        type: "GET",
      },
    ];

    if (post) res.json({ post, links });
    else next(error(404, "Post Not Found"));
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next(error(404, "Post Not Found"));
  })
  .delete((req, res, next) => {
    const postIndex = posts.findIndex((p) => p.id == req.params.id);

    if (postIndex !== -1) {
      const deletedPost = posts.splice(postIndex, 1);
      res.json(deletedPost[0]);
    } else next(error(404, "Post Not Found"));
  });


router
  .route("/:id/comments")         //comments/post/get///
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    if (post) {
      res.json(post.comments);
    } else {
      next(error(404, "Post Not Found"));
    }
  })
  .post((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    if (post && req.body.userId && req.body.body) {
      const comment = {
        id: post.comments.length + 1,
        userId: req.body.userId,
        body: req.body.body,
      };

      post.comments.push(comment);
      res.json(comment);
    } else {
      next(error(400, "Insufficient Data or Post Not Found"));
    }
  });

module.exports = router;