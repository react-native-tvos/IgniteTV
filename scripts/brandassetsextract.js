// ES6 version using asynchronous iterators, compatible with node v10.0+

const fs = require("fs").promises
const path = require("path")

const projectRoot = path.resolve(__dirname, "..")

const brandAssetsPath = path.resolve(
  projectRoot,
  "ios",
  "IgniteTV",
  "Images.xcassets",
  "TVAppIcon.brandassets",
)
console.log(brandAssetsPath)

async function walk(dir) {
  let json = {}
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) {
      const dirName = path.basename(d.path)
      const subtreeJson = await walk(entry)
      json[`${dirName}`] = subtreeJson
    } else if (d.isFile()) {
      if (path.basename(d.path) === "Contents.json") {
        const contentJsonString = await fs.readFile(d.path, { encoding: "utf-8" })
        const contentJson = JSON.parse(contentJsonString)
        json = {
          ...json,
          contents: contentJson,
        }
      }
    }
  }
  return json
}

// Then, use it with a simple async for loop
async function main() {
  const json = await walk(brandAssetsPath)
  console.log(JSON.stringify(json, null, 2))
}

main()
