import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "chai";
import App from "./App";
let jsdom = require("mocha-jsdom");

global.document = jsdom({
  url: "http://localhost:3000/"
});


let rootContainer : HTMLDivElement ;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
});

describe("App Component Testing", () => {
  it("Renders Hello World Title", () => {
    act(() => {
      ReactDOM.render(<App />, rootContainer);
    });
    const h1 = rootContainer.querySelector("h1");
    expect(h1!.textContent).to.equal("Hello World");
  });
});