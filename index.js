const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
const TodoTask = require("./models/TodoTask");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {});

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running and listening to port ${port}`);
});

// GET METHOD
app.get("/home", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  console.log(todoTask);
  try {
    await todoTask.save();
    res.redirect("/home");
  } catch (err) {
    res.redirect("/home");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/home");
    });
  });

//delete
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/home");
  });
});
