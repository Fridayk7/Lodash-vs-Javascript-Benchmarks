function generateString(filesize, length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var array1 = [];
  for (let s = 1; s <= filesize; s++) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    array1.push(result);
  }
  return array1;
}

function generateInt(filesize, length) {
  const characters = "0123456789";
  var array1 = [];
  for (let s = 1; s <= filesize; s++) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    array1.push(parseInt(result));
  }
  return array1;
}

function generateObj(filesize, length) {
  var array1 = [];
  for (let s = 1; s <= filesize; s++) {
    array1.push(createObj(length, true));
  }
  return array1;
}

function createObj(fieldCount, allowNested) {
  var generatedObj = { name: generateString(1, 50)[0] };

  for (var i = 0; i < fieldCount; i++) {
    var generatedObjField;

    switch (Math.floor(Math.random() * 6)) {
      case 0:
        generatedObjField = generateInt(1, 50)[0];
        break;

      case 1:
        generatedObjField = Math.random();
        break;

      case 2:
        generatedObjField = Math.random() < 0.5 ? true : false;
        break;

      case 3:
        generatedObjField = generateString(1, 50)[0];
        break;

      case 4:
        generatedObjField = null;
        break;

      case 5:
        generatedObjField = createObj(fieldCount, allowNested);
        break;
    }
    generatedObj[generateString(1, 50)[0]] = generatedObjField;
  }
  return generatedObj;
}

function jsFilter(data) {
  if (typeof data[0] == "object") {
    return data.filter((obj) => obj.name[0] == "K");
  } else if (typeof data[0] == "string") {
    return data.filter((s) => s[0] == "K");
  } else {
    return data.filter(
      (s) => s > 50000000000000000000000000000000000000000000000000
    );
  }
}

function lodashFilter(data) {
  if (typeof data[0] == "object") {
    return _.filter(data, (s) => s[0] == "K");
  } else if (typeof data[0] == "string") {
    return _.filter(data, (s) => s[0] == "K");
  } else {
    return _.filter(
      data,
      (s) => s > 50000000000000000000000000000000000000000000000000
    );
  }
}

function benchmarkFilter(data, loops) {
  var perf = { js: [], jsmean: [], lodash: [], lodashmean: [] };

  for (let i = 0; i <= loops; i++) {
    if (i % 2 == 0) {
      var startTime = window.performance.now();
      let data1 = jsFilter(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.js.push(endTime - startTime);

      var startTime = window.performance.now();
      let data2 = lodashFilter(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);
      if (_.isEqual(data1, data2) == false) {
        console.log("Interesting");
      }
    } else {
      var startTime = window.performance.now();
      lodashFilter(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);

      var startTime = window.performance.now();
      jsFilter(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.js.push(endTime - startTime);
    }
  }

  perf.lodash.shift();
  perf.js.shift();

  perf.lodashmean = _.mean(perf.lodash);
  perf.jsmean = _.mean(perf.js);

  return perf;
}

function runStringBenchmarkFilter(size) {
  let data = generateString(size, 50);
  let res = benchmarkFilter(data, 100);

  return res;
}

function runIntBenchmarkFilter(size) {
  let data = generateInt(size, 50);
  let res = benchmarkFilter(data, 100);
  return res;
}

function runObjBenchmarkFilter(size) {
  let data = generateObj(size, 2);
  let res = benchmarkFilter(data, 100);
  return res;
}

function registerData(key, newdata) {
  let existingDatajs = sessionStorage.getItem(key + "js");
  sessionStorage.setItem(
    key + "js",
    existingDatajs
      ? existingDatajs + newdata.js.toString()
      : newdata.js.toString()
  );
  let existingDatalodash = sessionStorage.getItem(key + "lodash");

  sessionStorage.setItem(
    key + "lodash",
    existingDatalodash
      ? existingDatalodash + newdata.lodash.toString()
      : newdata.lodash.toString()
  );
}

function displayResults(key, size, title) {
  console.log(key + size.toString() + "js");
  let js = sessionStorage.getItem(key + size.toString() + "js");
  let lodash = sessionStorage.getItem(key + size.toString() + "lodash");

  let arr1 = js.split(",").map((x) => parseFloat(x));
  let arr2 = lodash.split(",").map((x) => parseFloat(x));

  let jsmean = _.mean(arr1);
  let lodashmean = _.mean(arr2);

  const chartDataMean = [
    {
      label: "Javascript",
      data: [jsmean],
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: [lodashmean],
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];
  var titleh1 = document.createElement("h1"); // creates new canvas element
  titleh1.innerHTML = title + ` Datasize: ${size}`;
  document.body.appendChild(titleh1);

  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else {
    browserName = "No browser detection";
  }

  var titleh2 = document.createElement("h2"); // creates new canvas element
  titleh2.innerHTML = "Browser: " + browserName;
  document.body.appendChild(titleh2);

  var titleh3 = document.createElement("h3"); // creates new canvas element
  titleh3.innerHTML = `Test Runs Mean Value`;
  document.body.appendChild(titleh3);

  var canv2 = document.createElement("canvas"); // creates new canvas element
  canv2.id = `${key}Mean${size}`; // gives canvas id
  document.body.appendChild(canv2); // adds the canvas to the body element

  var myChart2 = new Chart(canv2, {
    type: "bar",
    data: {
      labels: ["Mean (ms)"],
      datasets: chartDataMean,
    },
  });
}

if (!sessionStorage.getItem("count")) {
  sessionStorage.setItem("count", 0);
}

let count = sessionStorage.getItem("count");
sessionStorage.setItem("count", +count + 1);

// !Important!
// Uncomment the benchmark you would like to run
// This will produce and save the data of the benchmark
// To see the results don't forget to uncomment the display function in the next !important! section

let data = runStringBenchmarkFilter(10000);
registerData("FilterString10000", data);

// data = runStringBenchmarkFilter(100000);
// registerData("FilterString100000", data);

// data = runStringBenchmarkFilter(1000000);
// registerData("FilterString1000000", data);

data = runIntBenchmarkFilter(10000);
registerData("FilterInt10000", data);

// data = runIntBenchmarkFilter(100000);
// registerData("FilterInt100000", data);

// data = runIntBenchmarkFilter(1000000);
// registerData("FilterInt1000000", data);

data = runObjBenchmarkFilter(10000);
registerData("FilterObj10000", data);

// data = runObjBenchmarkFilter(100000);
// registerData("FilterObj100000", data);

// data = runObjBenchmarkFilter(1000000);
// registerData("FilterObj1000000", data);

if (+count < 10) {
  console.log(count);
  location.reload();
} else {
  sessionStorage.setItem("count", 0);

  // !Important!
  // Uncomment the benchmark that run before to display it's data.
  // You can tell which benchmark to uncomment by seeing the first and second value of the function call bellow
  // E.g registerData("ShallowCopyString10000", data); (from above) maps to -> displayResults("ShallowCopyString", 10000, "ShallowCopy Function String");

  displayResults("FilterString", 10000, "Filter Function String");
  // displayResults("FilterString", 100000, "Filter Function String");
  // displayResults("FilterString", 1000000, "Filter Function String");
  displayResults("FilterInt", 10000, "Filter Function Integers");
  // displayResults("FilterInt", 100000, "Filter Function Integers");
  // displayResults("FilterInt", 1000000, "Filter Function Integers");
  displayResults("FilterObj", 10000, "Filter Function Objects");
  // displayResults("FilterObj", 100000, "Filter Function Objects");
  // displayResults("FilterObj", 1000000, "Filter Function Objects");
}
