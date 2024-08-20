const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require('cors');

const app = express();
app.use(cors())
const port = 8080;

if (!fs.existsSync(path.join(__dirname, "data.json"))) {
  fs.writeFileSync("data.json", JSON.stringify({ countries: [] }, null, 2));
}

// get File data
const getData = async () => {
  try {
    let data = fs.readFileSync(path.join(__dirname, "data.json"));
    return JSON.parse(data);
  } catch (error) {
    return { error: error };
  }
};

const addData = async (obj, key) => {
  try {
    const data = await getData();
    const result = await validateData(data, obj);
    if (result.status == "success") {
      data["countries"][data["countries"].length] = obj;
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync("data.json", jsonString, "utf-8", (err) => {
        if (err) throw err;
        console.log("Data added to file");
      });
      return { status: "success" };
    } else {
      return result;
    }
  } catch (error) {
    return error;
  }
};

const validateData = async (original, compare) => {
  try {
    const { name, rank } = compare;
    const existingCountry = original["countries"].find(
      (country) => country.name === name
    );
    if (existingCountry) {
      return {
        status: "unsuccess",
        message: "Country name already exists",
        errorFields: ["name"],
      };
    }
    const existingRank = original["countries"].find(
      (country) => country.rank === rank
    );
    if (existingRank) {
      return {
        status: "unsuccess",
        message: "Rank already exists",
        errorFields: ["rank"],
      };
    }
    return { status: "success" };
  } catch (error) {
    console.log(error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Server Running !!!!!!!!!!");
});

app.get("/countries", async (req, res) => {
  try {
    const data = await getData();
    const result = data.countries.map((item, index) => {
      return { id: index.toString(), name: item.name };
    });
    res.status(200).send({ status: "success", data: result });
  } catch (error) {
    res.send({ status: "unsuccess", data: [], error: error });
  }
});

app.get("/countries/all", async (req, res) => {
  try {
    const data = await getData();
    res.status(200).send({ status: "success", data: data.countries || [] });
  } catch (error) {
    res.send({ status: "unsuccess", data: [], error: error });
  }
});

app.get("/countries/:id", async (req, res) => {
  try {
    const data = await getData();
    const id = req.params.id;
    let result = data.countries.map((item, index) => {
      return { id: index.toString(), ...item };
    });
    result = result.filter((item) => {
      if (item.id === id) {
        return item;
      }
    });

    if (result.length > 0)
      res.status(200).send({ status: "success", data: result });
    else res.status(200).res.send({ status: "success", data: [] });
  } catch (error) {
    res.send({ status: "unsuccess", data: [], error: error });
  }
});

app.post("/countries", upload.single("image"), async (req, res) => {
  const reqData = req.body;

    let {name} = reqData;
    name = name.trim().toLowerCase();
  //   console.log('Saved Filename:', req.file);
  reqData.flag = `images/${name}${path.extname(req.file.originalname)}`;
  const result = await addData(reqData);
  if (result.status == "success") {
    const oldPath = path.join(__dirname, "public/images/", req.file.filename);
    const newPath = path.join(
      __dirname,
      "public/images/",
      name + path.extname(req.file.originalname)
    );

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        res.status(500).send("Error renaming file.");
      }
    });
    res
      .status(200)
      .send({ status: "success", message: "Country added successfully." });
  } else {
    const filePath = path.join(__dirname, "public/images/", req.file.filename);
    fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error removing file:", err);
    }
  });
    res.status(400).send(result);
  }
});

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
