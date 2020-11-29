/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import preval from 'preval.macro';

export const stories = preval`
const path = require("path")
console.log("preval")
const cwd = process.cwd()
const {stories} = require(path.join(cwd, "/.storybook/main.js"))
const fs = require("fs")
fs.writeFileSync(path.join(cwd, "/storybook.requires.js"), "")

const fileContent = stories.map((story)=>{
  return "require('" + story + "')"
}).join(";")

fs.writeFileSync(path.join(cwd, "/storybook.requires.js"), fileContent,{encoding:'utf8',flag:'w'})

module.exports = {default: ""}

`;

// console.log(stories);
// stories.forEach((story) => {
//   require(story);
// });
