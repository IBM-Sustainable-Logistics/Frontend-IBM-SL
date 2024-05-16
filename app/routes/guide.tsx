import React from "react";
import wholepage1 from "public/Images/CalculatorWholePage1.png";
import leftside1 from "public/Images/CalculatorLeftSection1.png";
import middleside1 from "public/Images/CalculatorMiddleSection1.png";
import middleside2 from "public/Images/CalculatorMiddleSection2.png";
import rightside1 from "public/Images/CalculatorRightSection1.png";
import rightside2 from "public/Images/CalculatorRightSection2.png";
import rightsidedist1 from "public/Images/CalculatorRightSectionDist1.png";
import rightsidedist2 from "public/Images/CalculatorRightSectionDist2.png";

const GuidePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div style={{ maxWidth: "800px" }}>
        <h1 className="text-primary text-4xl font-bold font-mono mb-6">
          Guide to using the Calculator
        </h1>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In this how-to guide, we will guide you through the process of using
          our calculator, whether you prefer to enter your information manually
          or, upload a datasheet. You can start using the calculator today and
          take the first step towards reducing your impact!
        </p>

        <p className="mb-6">
          You can access the calculator by pressing the 'Calculate Emissions'
          tab on the navigation bar above, or press this link{" "}
          <a href="/calculate-emissions" style={{ color: "#3d815c" }}>here.</a>
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-2xl font-bold font-mono mb-6">
          1. On entering the calculator page
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          When entering the calculator page, you may immediately notice three
          'sections' on the page. The left side, which contains information
          about the current project, the middle section, which shows you each
          individual step that you have so far (just one if you just opened the
          page), and the right section. The right section allows you to type the
          individual data that you have about the transport - it is type, the
          cargo weight, as well as the address. Let us explore the individual
          sections in detail:
        </p>

        <img
          src={wholepage1}
          alt="The main page when clicking the 'Calculate Emissions' tab in the navigation tab above."
        />
        <p className="mb-6">
          The main page when clicking the 'Calculate Emissions' tab in the
          navigation tab above.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-xl font-bold font-mono mb-6">
          1.1. The left section
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          On the left side of the page, we can see information regarding the
          current calculation. We have the project name, as well as all the
          routes and its associated stages with it. While you will not give the
          actual data (like addresses and tonnage) from here, you can still
          choose to upload a datasheet of your destinations if you wish to.
        </p>

        <img
          src={leftside1}
          width={345}
          height={440}
          alt="The left section of the Calculator page."
        />
        <p className="mb-6">The left section of the Calculator page.</p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-xl font-bold font-mono mb-6">
          1.2. The middle section
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          In the middle section, you can find information about the current
          information that you have provided for the current stage. Upon
          entering the page for the first time, or just creating a new route,
          this section will not show much, other than the route number (which is
          just number one), as well as a base stage only showing the transport
          method. If you have multiple stages that you’ll like to provide, then
          you can just press the blue ‘Add Stage’ button to add the next stage
          of your transportation.
        </p>

        <p className="mb-6">
          For example: say that you have transport going from Helsinki, to
          Stockholm, to Copenhagen. That is three different cities in total.
          Then, you can simply start with Helsinki to Stockholm; you can add
          Helsinki, Finland as the origin address, and then Stockholm, Sweden as
          the destination address. And then, when you want to add Stockholm to
          Copenhagen as the next destination, you can simply press ‘Add Stage’
          to create the next stage going from Stockholm to Copenhagen.
        </p>

        <p className="mb-6">
          Note: when adding a new stage, our calculator will create a new stage
          where the origin address is just the destination address of the last
          stage. Of course, you can edit this if you wish.
        </p>

        <img
          src={middleside1}
          width={345}
          height={440}
          alt="The middle section of the Calculator page, initially being empty."
        />
        <p className="mb-6">
          The middle section of the Calculator page, initially being empty.
        </p>

        <img
          src={middleside2}
          width={345}
          height={440}
          alt="The middle section of the Calculator page, after being populated with (example) data."
        />
        <p className="mb-6">
          The middle section of the Calculator page, after being populated with
          (example) data.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-xl font-bold font-mono mb-6">
          1.3. The right section
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          The right section of the calculator page will be your main point in
          which you provide the data (again unless you{" "}
          <a href="/template" style={{ color: "#3d815c" }}>upload a file</a>).
          In this section, you will provide the actual data that you wish to
          include in your calculations.
        </p>

        <p className="mb-6">
          There are four main pieces of information that you’ll need to provide:
          the transport type (default value being ‘truck’), the cargo weight (in
          tonnage), the origin address (where the cargo is going from), and the
          destination address (where the cargo is going to). Upon clicking the
          ‘Calculate’ button, you will retrieve a popup telling you the total
          tonnage of CO2 that has been calculated from your input. The middle
          section of the page will then be updated to reflect the data that you
          have added for the current stage.
        </p>

        <p className="mb-6">
          As explained with an example under ‘1.2. The middle section’, if you
          wish to add multiple stages to your total calculation, then you can
          simply press the blue ‘Add Stage’ button and add as many stages as you
          wish.
        </p>

        <img
          src={rightside1}
          width={345}
          height={440}
          alt="The right section of the Calculator page, initially being empty."
        />
        <p className="mb-6">
          The right section of the Calculator page, initially being empty.
        </p>

        <img
          src={rightside2}
          width={345}
          height={440}
          alt="The right section of the Calculator page, after being populated with (example) data."
        />
        <p className="mb-6">
          The right section of the Calculator page, after being populated with
          (example) data.
        </p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        <h2 className="text-primary text-l font-bold font-mono mb-6">
          1.3.1. Distance instead of addresses?
        </h2>
      </div>
      <div style={{ maxWidth: "800px" }}>
        <p className="mb-6">
          If you wish to use distances (provided in kilometers) instead of
          specific addresses, then you will need to click the ‘Use Distance?’
          button to active distance mode. It’s very similar to the previous
          method; instead, you just need to provide a single distance for each
          stage that you wish to add to your calculations.
        </p>

        <img
          src={rightsidedist1}
          width={345}
          height={440}
          alt="The right section of the Calculator page, initially being empty."
        />
        <p className="mb-6">
          The right section of the Calculator page, initially being empty.
        </p>

        <img
          src={rightsidedist2}
          width={345}
          height={440}
          alt="The right section of the Calculator page, after being populated with (example) data."
        />
        <p className="mb-6">
          The right section of the Calculator page, after being populated with
          (example) data.
        </p>
      </div>
    </div>
  );
};

export default GuidePage;
