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

function jsReduce(data) {
  if (typeof data[0] == "object") {
    const initialValue = "";
    const sumWithInitial = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.name[0],
      initialValue
    );
    return sumWithInitial;
  } else if (typeof data[0] == "string") {
    const initialValue = "";
    const sumWithInitial = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue[0],
      initialValue
    );
    return sumWithInitial;
  } else {
    const initialValue = 0;
    const sumWithInitial = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
    return sumWithInitial;
  }
}

function lodashReduce(data) {
  if (typeof data[0] == "object") {
    let sumWithInitial = _.reduce(
      data,
      (sum, n) => {
        return sum + n.name[0];
      },
      ""
    );
    return sumWithInitial;
  } else if (typeof data[0] == "string") {
    let sumWithInitial = _.reduce(
      data,
      (sum, n) => {
        return sum + n[0];
      },
      ""
    );
    return sumWithInitial;
  } else {
    let sumWithInitial = _.reduce(
      data,
      (sum, n) => {
        return sum + n;
      },
      0
    );
    return sumWithInitial;
  }
}

function benchmarkReduce(data, loops) {
  var perf = { js: [], jsmean: [], lodash: [], lodashmean: [] };

  for (let i = 0; i <= loops; i++) {
    if (i % 2 == 0) {
      var startTime = window.performance.now();
      let data1 = jsReduce(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.js.push(endTime - startTime);

      var startTime = window.performance.now();
      let data2 = lodashReduce(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);
      if (_.isEqual(data1, data2) == false) {
        console.log("Interesting");
      }
    } else {
      var startTime = window.performance.now();
      lodashReduce(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);

      var startTime = window.performance.now();
      jsReduce(data); // <---- measured code goes between startTime and endTime
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

function runStringBenchmarkReduce(size) {
  let data = generateString(size, 50);
  console.log(data);
  let res = benchmarkReduce(data, 100);

  return res;
}

function runIntBenchmarkReduce(size) {
  let data = generateInt(size, 50);
  let res = benchmarkReduce(data, 100);
  return res;
}

function runObjBenchmarkReduce(size) {
  let data = generateObj(size, 2);
  let res = benchmarkReduce(data, 100);
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

let data = runStringBenchmarkReduce(10000);
registerData("ReduceString10000", data);

// data = runStringBenchmarkReduce(100000);
// registerData("ReduceString100000", data);

// data = runStringBenchmarkReduce(1000000);
// registerData("ReduceString1000000", data);

data = runIntBenchmarkReduce(10000);
registerData("ReduceInt10000", data);

// data = runIntBenchmarkReduce(100000);
// registerData("ReduceInt100000", data);

// data = runIntBenchmarkReduce(1000000);
// registerData("ReduceInt1000000", data);

data = runObjBenchmarkReduce(10000);
registerData("ReduceObj10000", data);

// data = runObjBenchmarkReduce(100000);
// registerData("ReduceObj100000", data);

// data = runObjBenchmarkReduce(1000000);
// registerData("ReduceObj1000000", data);

if (+count < 10) {
  console.log(count);
  location.reload();
} else {
  sessionStorage.setItem("count", 0);

  // !Important!
  // Uncomment the benchmark that run before to display it's data.
  // You can tell which benchmark to uncomment by seeing the first and second value of the function call bellow
  // E.g registerData("ShallowCopyString10000", data); (from above) maps to -> displayResults("ShallowCopyString", 10000, "ShallowCopy Function String");

  displayResults("ReduceString", 10000, "Reduce Function String");
  // displayResults("ReduceString", 100000, "Reduce Function String");
  // displayResults("ReduceString", 1000000, 'Reduce Function String');
  displayResults("ReduceInt", 10000, "Reduce Function Integers");
  // displayResults("ReduceInt", 100000, "Reduce Function Integers");
  // displayResults("ReduceInt", 1000000, 'Reduce Function Integers');
  displayResults("ReduceObj", 10000, "Reduce Function Objects");
  // displayResults("ReduceObj", 100000, "Reduce Function Objects");
  // displayResults("ReduceObj", 1000000, 'Reduce Function Objects');
}
