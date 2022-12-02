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
    let obj = createObj(length, true);
    console.log(obj);
    array1.push(createObj(length, true));
  }
  return array1;
}

function createObj(fieldCount, allowNested) {
  var generatedObj = {};

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

function jsforEach(data) {
  if (typeof data[0] == "object") {
    data.forEach(
      (element) => data[Object.keys(element)[0]] + data[Object.keys(element)[0]]
    );
  } else {
    data.forEach((element) => element + element);
  }
  return "Done";
}

function lodashforEach(data) {
  if (typeof data[0] == "object") {
    _.forEach(
      data,
      (element) => data[Object.keys(element)[0]] + data[Object.keys(element)[0]]
    );
  } else {
    _.forEach(data, (element) => element + element);
  }
  return "Done";
}

function benchmarkforEach(data, loops) {
  var perf = { js: [], jsmean: [], lodash: [], lodashmean: [] };

  for (let i = 0; i <= loops; i++) {
    if (i % 2 == 0) {
      var startTime = window.performance.now();
      jsforEach(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.js.push(endTime - startTime);

      var startTime = window.performance.now();
      lodashforEach(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);
    } else {
      var startTime = window.performance.now();
      lodashforEach(data); // <---- measured code goes between startTime and endTime
      var endTime = window.performance.now();
      perf.lodash.push(endTime - startTime);

      var startTime = window.performance.now();
      jsforEach(data); // <---- measured code goes between startTime and endTime
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

function runStringBenchmarkforEach(size) {
  let data = generateString(size, 50);
  let res = benchmarkforEach(data, 100);
  const chartData = [
    {
      label: "Javascript",
      data: res.js,
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: res.lodash,
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  const chartDataMean = [
    {
      label: "Javascript",
      data: [res.jsmean],
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: [res.lodashmean],
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];
  var title = document.createElement("h1"); // creates new canvas element
  title.innerHTML = `forEach Function Strings - Datasize: ${size}`;
  document.body.appendChild(title);

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Test Runs`;
  document.body.appendChild(title);

  var canv = document.createElement("canvas"); // creates new canvas element
  canv.id = `forEachString${size}`; // gives canvas id
  document.body.appendChild(canv); // adds the canvas to the body element

  var myChart = new Chart(canv, {
    type: "bar",
    data: {
      labels: Array.apply(null, { length: res.js.length }).map(
        Function.call,
        Number
      ),
      datasets: chartData,
    },
  });

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Mean Value`;
  document.body.appendChild(title);

  var canv2 = document.createElement("canvas"); // creates new canvas element
  canv2.id = `forEachStringMean${size}`; // gives canvas id
  document.body.appendChild(canv2); // adds the canvas to the body element

  var myChart2 = new Chart(canv2, {
    type: "bar",
    data: {
      labels: ["Mean"],
      datasets: chartDataMean,
    },
  });

  return res;
}

function runIntBenchmarkforEach(size) {
  let data = generateInt(size, 50);
  let res = benchmarkforEach(data, 100);
  const chartData = [
    {
      label: "Javascript",
      data: res.js,
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: res.lodash,
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  const chartDataMean = [
    {
      label: "Javascript",
      data: [res.jsmean],
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: [res.lodashmean],
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  var title = document.createElement("h1"); // creates new canvas element
  title.innerHTML = `forEach Function Integers - Datasize: ${size}`;
  document.body.appendChild(title);

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Test Runs`;
  document.body.appendChild(title);

  var canv = document.createElement("canvas"); // creates new canvas element
  canv.id = `forEachInt${size}`; // gives canvas id
  document.body.appendChild(canv); // adds the canvas to the body element

  var myChart = new Chart(canv, {
    type: "bar",
    data: {
      labels: Array.apply(null, { length: res.js.length }).map(
        Function.call,
        Number
      ),
      datasets: chartData,
    },
  });

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Mean Value`;
  document.body.appendChild(title);

  var canv2 = document.createElement("canvas"); // creates new canvas element
  canv.id = `forEachIntMean${size}`; // gives canvas id
  document.body.appendChild(canv2); // adds the canvas to the body element

  var myChart2 = new Chart(canv2, {
    type: "bar",
    data: {
      labels: ["Mean"],
      datasets: chartDataMean,
    },
  });
}

function runObjBenchmarkforEach(size) {
  let data = generateObj(size, 2);
  let res = benchmarkforEach(data, 100);
  const chartData = [
    {
      label: "Javascript",
      data: res.js,
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: res.lodash,
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  const chartDataMean = [
    {
      label: "Javascript",
      data: [res.jsmean],
      borderColor: "#FFCCCB",
      backgroundColor: "#FFCCCB",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: "Lodash",
      data: [res.lodashmean],
      borderColor: "#ADD8E6",
      backgroundColor: "#ADD8E6",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  var title = document.createElement("h1"); // creates new canvas element
  title.innerHTML = `forEach Function Objects - Datasize: ${size}`;
  document.body.appendChild(title);

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Test Runs`;
  document.body.appendChild(title);

  var canv = document.createElement("canvas"); // creates new canvas element
  canv.id = `forEachInt${size}`; // gives canvas id
  document.body.appendChild(canv); // adds the canvas to the body element

  var myChart = new Chart(canv, {
    type: "bar",
    data: {
      labels: Array.apply(null, { length: res.js.length }).map(
        Function.call,
        Number
      ),
      datasets: chartData,
    },
  });

  var title = document.createElement("h3"); // creates new canvas element
  title.innerHTML = `Mean Value`;
  document.body.appendChild(title);

  var canv2 = document.createElement("canvas"); // creates new canvas element
  canv.id = `forEachIntMean${size}`; // gives canvas id
  document.body.appendChild(canv2); // adds the canvas to the body element

  var myChart2 = new Chart(canv2, {
    type: "bar",
    data: {
      labels: ["Mean"],
      datasets: chartDataMean,
    },
  });
}

runStringBenchmarkforEach(10000);

runStringBenchmarkforEach(100000);
// runStringBenchmarkforEach(1000000);

runIntBenchmarkforEach(10000);
runIntBenchmarkforEach(100000);
//runIntBenchmarkforEach(1000000);

runObjBenchmarkforEach(10000);
runObjBenchmarkforEach(100000);
//runObjBenchmarkforEach(1000000);
