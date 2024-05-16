import React, { useState } from "react";
import { Button } from "../components/ui/button.tsx";

import goodexample1 from "public/Images/goodexample1.png";
import goodexample2 from "public/Images/goodexample2.png";
import badexample1 from "public/Images/badexample1.png";
import badexample2 from "public/Images/badexample2.png";
import badexample3 from "public/Images/badexample3.png";
import checkdistance from "public/Images/checkdistance.png";
import goodexample3 from "public/Images/goodexample3.png";
import templateZIP from "public/Images/IBM_SL_Upload_Template_v1.zip";

const Template = () => {
  /**
   * Taken and modified from: https://medium.com/charisol-community/downloading-resources-in-html5-a-download-may-not-work-as-expected-bf63546e2baa
   * Original author: Jude Agboola
   * Platform: medium.com
   * Retrieved: 29-04-2024
   */
  const [fetching, setFetching] = useState(false);
  const [_error, setError] = useState(false);

  const download = (url: string | URL | Request, name: string) => {
    if (!url) {
      throw new Error("Resource URL not provided!");
    }
    setFetching(true);
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        setFetching(false);
        const blobURL = URL.createObjectURL(blob);
        const anchorElement = document.createElement("a");
        anchorElement.href = blobURL;

        if (name && name.length) {
          anchorElement.download = name;
        }

        document.body.appendChild(anchorElement);
        anchorElement.click();
      })
      .catch(() => setError(true));
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div style={{ maxWidth: "800px" }}>
        <h1 className="text-primary text-4xl font-bold font-mono mb-6">
          Uploading your own data
        </h1>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In order to upload a file, you need to make sure that your file
          implements the following rules described as below. Furthermore, there
          is a template available for you to download and use.
        </p>
      </div>

      <div className="mb-6" style={{ maxWidth: "800px" }}>
        <Button
          disabled={fetching}
          variant="default"
          onClick={() => download(templateZIP, "Template_version_0.zip")}
        >
          Download Template
        </Button>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-2xl font-bold font-mono mb-6">
          1. Check the file type and extension
        </h2>
      </div>
      <div>
        <p className="mb-6">Our platform supports the following file types:</p>
        <ul className="mb-6">
          <li>
            - Excel, of file extension <b>.xls / .xlsx</b>
          </li>
        </ul>
        <p className="mb-6">
          If the file extension is NOT one of the above, then our application
          will reject the file, and ask you to try again.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-2xl font-bold font-mono mb-6">
          2. File structure
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In order for the file to be successfully uploaded and read, it will
          need to follow a specific structure. Currently, there are two main
          ways of structuring the data inside your file:
        </p>
        <ul className="mb-6">
          <li>
            - <b>Using address</b>
          </li>
          <li>
            - <b>Distance mode</b>
          </li>
        </ul>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h3 className="text-primary text-xl font-bold font-mono mb-6">
          2.1. Using addresses
        </h3>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In order to use addresses, you need to atleast use four cells. These
          four cells should have the titles: &nbsp;<b>Origin city</b>,{" "}
          <b>Origin country</b>, <b>Destination city</b>, and{" "}
          <b>Destination country</b>. Under each of these cells, you should
          write the information they describe. Remember: the data has to be
          BELOW the descriptive cells! For example, if cell <b>A1</b>
          &nbsp;has the title{" "}
          <b>Origin city</b>, then the origin city name should be in the cell
          {" "}
          <b>A2</b>.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={goodexample1}
          alt="Example 1 of a valid excel file structure."
        />
        <p className="mb-6">
          Example 1: a valid file structure using addresses.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={goodexample1}
          alt="Example 2 of a valid excel file structure."
        />
        <p className="mb-6">
          Example 2: a valid file structure using multiple addresses.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={badexample1}
          alt="Example 3 of an invalid excel file structure."
        />
        <p className="mb-6">
          Example 3: an invalid file structure using addresses.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={badexample2}
          alt="Example 4 of an invalid excel file structure."
        />
        <p className="mb-6">
          Example 4: another invalid file structure using addresses.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h3 className="text-primary text-xl font-bold font-mono mb-6">
          2.2. Using distance numbers
        </h3>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In order to give the distance (which is in kilometer), you need to
          atleast use two cells. One of the cells should have the title:
          &nbsp;<b>Distance</b>. Under each of these cells, you should write the
          distance length. Remember: the data has to be BELOW the descriptive
          cell! For example, if cell <b>A1</b> has the title{" "}
          <b>Distance</b>, then the distance length should be in the cell{" "}
          <b>A2</b>.
        </p>

        <p className="mb-6">
          <b>REMEMBER:</b>set 'use distance' on under the upload file page!
        </p>
        <img
          src={checkdistance}
          alt="'use distance' should be activated if you want to provide distance numbers instead."
        />
        <p className="mb-6">
          'use distance' should be activated if you want to provide distance
          numbers instead
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={goodexample2}
          alt="Example 5 of a valid excel file structure."
        />
        <p className="mb-6">
          Example 5: a valid file structure using distances.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <img
          src={badexample3}
          alt="Example 6 of an invalid excel file structure."
        />
        <p className="mb-6">
          Example 6: an invalid file structure using distances.
        </p>
      </div>
    </div>
  );
};

export default Template;
