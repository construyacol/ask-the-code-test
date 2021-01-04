const fs = require("fs");
const keys = getKeys("./build");

const deploySetup = {
  staging: {
    bucket: "app.devsertec.com",
  },
  prod: {
    bucket: "app.coinsenda.com",
  },
};

const setupEntries = Object.keys(deploySetup);

const argType = process.argv[2];
const argProfile = process.argv[3];

const validateType = function (deployType) {
  if (!deployType || !deployType["bucket"]) {
    console.error(
      `Deploy type not recognized ${deployType}. Use one of ${setupEntries.join(
        " | "
      )}`
    );
    process.exit();
  }
};

// Check for arguments
if (argType && argProfile) {
  // If argumented, try to run with supplied args
  const bucketName = deploySetup[argType].bucket;
  console.log("Deploying to", bucketName);
  process.env.AWS_PROFILE = argProfile;
  cleanBucket(bucketName);
} else {
  // No argumented options? No problem, here's a questionaire and a hint for you
  console.log(
    "You could run this script providing type and profile, like `yarn deploy staging s3_profile`"
  );
  const Input = require("prompt-input");
  const profileInput = new Input({
    name: "awsProfile",
    message: "What AWS profile do you want to use?",
  });
  const deployInput = new Input({
    name: "deployType",
    message: `Where do you want to deploy? (${setupEntries.join("/")})`,
  });

  deployInput.ask(function (deployType) {
    validateType(deploySetup[deployType]);
    const bucketName = deploySetup[deployType].bucket;
    console.log("Deploying to", bucketName);

    profileInput.ask(function (profile) {
      process.env.AWS_PROFILE = profile;
      cleanBucket(bucketName);
    });
  });
}

function getKeys(path) {
  const files = [];
  addFiles(path, files);
  return files.map((file) => {
    return {
      relative: file,
      key: file.replace(path + "/", ""),
    };
  });
}
function addFiles(path, arr) {
  fs.readdirSync(path).forEach((file) => {
    var st = fs.statSync(path + "/" + file);
    if (st.isDirectory()) {
      addFiles(path + "/" + file, arr);
    } else {
      // except .map files
      if (!file.match(".map") && !file.match(/^\./)) {
        arr.push(path + "/" + file);
      }
    }
  });
}
function cleanBucket(bucket) {
  const AWS = require("aws-sdk");

  AWS.config.update({ region: "us-east-1" });

  var s3 = new AWS.S3({
    region: "us-east-1",
    apiVersion: "2006-03-01",
  });
  console.log("Getting file list from S3");
  s3.listObjects({ Bucket: bucket }, function (err2, data) {
    if (err2) {
      console.log("Error", err2);
    } else {
      function processQ() {
        var file = keys.pop();

        if (!file) {
          console.log("All files uploaded");
          process.exit();
        }

        console.log("Uploading ", file.relative);
        var s3upload = {
          Bucket: bucket,
          Key: file.key,
          Body: fs.createReadStream(file.relative),
          ACL: "bucket-owner-full-control",
        };
        if (file.key.match(/html$/)) {
          s3upload.ContentType = "text/html";
          s3upload.ContentLanguage = "html";
          s3upload.ContentDisposition = "inline";
        } else if (file.key.match(/\.js$/)) {
          s3upload.ContentType = "application/javascript";
          s3upload.ContentDisposition = "inline";
        } else if (file.key.match(/manifest/)) {
          s3upload.ContentType = "application/manifest+json";
          s3upload.ContentDisposition = "inline";
        } else if (file.key.match(/json$/)) {
          s3upload.ContentType = "application/json";
          s3upload.ContentDisposition = "inline";
        } else if (file.key.match(/css$/)) {
          s3upload.ContentType = "text/css";
          s3upload.ContentDisposition = "inline";
        } else if (file.key.match(/svg$/)) {
          s3upload.ContentType = "image/svg+xml";
          s3upload.ContentDisposition = "inline";
        }
        s3.upload(s3upload, (err, data) => {
          if (err) {
            console.log(err);
          }
          console.log("Done");
          processQ();
        });
      }

      if (data.Contents.length > 0) {
        console.log(
          "Deleting",
          data.Contents.map((file) => file.Key)
        );

        var s3delete = {
          Bucket: bucket,
          Delete: {
            Objects: data.Contents.map((file) => {
              return { Key: file.Key };
            }),
          },
        };

        s3.deleteObjects(s3delete, function (err3, data) {
          if (err3) {
            console.log("Error", err3);
          } else {
            console.log("Bucket emptied");
            processQ();
          }
        });
      } else {
        console.log("Bucket was already empty (!)");
        processQ();
      }
    }
  });
}
