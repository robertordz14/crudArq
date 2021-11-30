process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

if (process.env.NODE_ENV === "dev") {
  process.env.URLDB =
   "mongodb+srv://scro:scro@cluster0.1wyll.mongodb.net/mvcArq?retryWrites=true&w=majority";
} else {
  process.env.URLDB =
    "mongodb+srv://scro:scro@cluster0.1wyll.mongodb.net/mvcArq?retryWrites=true&w=majority";
}

process.middlewares = [];
