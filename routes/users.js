const express = require("express");
const router = express.Router();

const users = require("../data/users");
const error = require("../utilities/error");


//GET /api/users/:id/posts
//Retrieves all posts by a user with the specified id.//


router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  //making sure the user doesnt already exist//
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  
  });

  //Retrieves all posts by a user with the specified id.//
  router.get("/:id/posts", (req, res, next) => {
    const userId = parseInt(req.params.id);
  
    // Find the user
    router
    .route('/:id')
    .get, ((req, res) => {
      res.send('User Get with ID ${req.params.id}')
  })

  .put((req, res) => {
    res.send('Update User with ID ${req.params.id}')
})


.delete((req, res) => {
  res.send('Update User with ID ${req.params.id}')
})

router.param("id", (req, res, next, id) => {
  console.log(id)
  next()
})

const users = [{name: "Carey"}, {name: "Mikoto"}, {name: "Ronald"}, ]
router.param("id", (req, res, next, id) => {
  req.user = users[id]
  next()
})
  
    // Get that user's posts
    const userPosts = posts.filter((p) => p.userId === userId);
  
    const links = [
      {
        href: `/api/posts`,
        rel: "all-posts",
        type: "GET",
      },
      {
        href: `/api/posts`,
        rel: "create-post",
        type: "POST",
      },
    ];
  
    res.json({ user: user.username, posts: userPosts, links });
  });


module.exports = router;
