import mongoose from "mongoose";

export default () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connect(
      process.env.DB_HOST,
      { useNewUrlParser: true, useUnifiedTopology: true },
      error => {
        if (error) {
          console.log("MongoDB Connection Error", error);
        } else {
          console.log("MongoDB Connection Success");
        }
      }
    );
  };

  connect();
  mongoose.connection.on("error", error => {
    console.error("mongoDB Connection Error", error);
  });

  mongoose.connection.on("disconnctioned", () => {
    console.error("mongoDB DisConnected.. try again");
    connect();
  });
};
