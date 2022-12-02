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

function jsSort(data) {
  if (typeof data[0] == "object") {
    data.sort((a, b) => (a.name > b.name ? 1 : -1));
  } else {
    data.sort();
  }
  return "Done";
}

function lodashSort(data) {
  if (typeof data[0] == "object") {
    _.sortBy(data, ["name"]);
  } else {
    _.sortBy(data);
  }
  return "Done";
}

function benchmarkSort(data, loops) {
  var perf = { js: [], jsmean: [], lodash: [], lodashmean: [] };

  for (let i = 0; i <= loops; i++) {
    if (i % 2 == 0) {
      var startTime = window.performance.now();
      jsSort(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.js.push(endTime - startTime);

      var startTime = window.performance.now();
      lodashSort(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);
    } else {
      var startTime = window.performance.now();
      lodashSort(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);

      var startTime = window.performance.now();
      jsSort(data); // <---- measured code goes between startTime and endTime
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

function runStringBenchmarkSort(size) {
  let data = generateString(size, 50);
  let res = benchmarkSort(data, 100);

  return res;
}

function runIntBenchmarkSort(size) {
  let data = generateInt(size, 50);
  let res = benchmarkSort(data, 100);
  return res;
}

function runObjBenchmarkSort(size) {
  let data = generateObj(size, 2);
  let res = benchmarkSort(data, 100);
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

let data = runStringBenchmarkSort(10000);
registerData("SortString10000", data);

// data = runStringBenchmarkSort(100000);
// registerData("SortString100000", data);

// data = runStringBenchmarkSort(1000000);
// registerData("SortString1000000", data);

data = runIntBenchmarkSort(10000);
registerData("SortInt10000", data);

// data = runIntBenchmarkSort(100000);
// registerData("SortInt100000", data);

// data = runIntBenchmarkSort(1000000);
// registerData("SortInt1000000", data);

data = runObjBenchmarkSort(10000);
registerData("SortObj10000", data);

// data = runObjBenchmarkSort(100000);
// registerData("SortObj100000", data);

// data = runObjBenchmarkSort(1000000);
// registerData("SortObj1000000", data);

if (+count < 10) {
  console.log(count);
  location.reload();
} else {
  sessionStorage.setItem("count", 0);

  // !Important!
  // Uncomment the benchmark that run before to display it's data.
  // You can tell which benchmark to uncomment by seeing the first and second value of the function call bellow
  // E.g registerData("ShallowCopyString10000", data); (from above) maps to -> displayResults("ShallowCopyString", 10000, "ShallowCopy Function String");

  displayResults("SortString", 10000, "Sort Function String");
  // displayResults("SortString", 100000, "Sort Function String");
  // displayResults("SortString", 1000000, 'Sort Function String');
  displayResults("SortInt", 10000, "Sort Function Integers");
  // displayResults("SortInt", 100000, "Sort Function Integers");
  // displayResults("SortInt", 1000000, 'Sort Function Integers');
  displayResults("SortObj", 10000, "Sort Function Objects");
  // displayResults("SortObj", 100000, "Sort Function Objects");
  // displayResults("SortObj", 1000000, 'Sort Function Objects');
}
