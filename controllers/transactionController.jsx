const transactionObject = require("../model/dataModel.jsx");

let seedData;
module.exports.initialize_db = async (req, res, next) => {
  try {
    const response = await axios.get(
      "http://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    seedData = await response.data;
    const result = await transactionObject.insertMany(seedData);

    res.json({ success: true, message: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to initialize the database" });
  }
};

module.exports.transactions = async (req, res, next) => {
  const { month } = req.query;
  console.log(month);
  const transactions = await transactionObject.find();
  let filteredData = transactions.filter((each) => {
    const date = new Date(each.dateOfSale);
    return date.getMonth() == month;
  });

  console.log(transactions);
  res.send(filteredData);
};

module.exports.statistics = async (req, res, next) => {
  const { month } = req.query;
  const transactions = await transactionObject.find();
  let filteredData = transactions.filter((each) => {
    const date = new Date(each.dateOfSale);
    return date.getMonth() == month;
  });
  console.log(filteredData.length);
  let amount = 0;
  let solditems = 0;
  let unsold = 0;
  filteredData.map((each) => {
    if (each.sold === true) {
      amount += each.price;
      solditems += 1;
    } else {
      unsold += 1;
    }
  });

  res.json({
    totalSaleAmount: Math.round(amount),
    totalSoldItems: solditems,
    totalNotSoldItems: unsold,
  });
};

function categorizePrice(price) {
  if (price <= 100) return "0-100";
  else if (price <= 200) return "101-200";
  else if (price <= 300) return "201-300";
  else if (price <= 400) return "301-400";
  else if (price <= 500) return "401-500";
  else if (price <= 600) return "501-600";
  else if (price <= 700) return "601-700";
  else if (price <= 800) return "701-800";
  else if (price <= 900) return "801-900";
  else return "901-above";
}

module.exports.barchart = async (req, res, next) => {
  const { month } = req.query;
  const transactions = await transactionObject.find();
  const filteredData = transactions.filter(
    (item) => new Date(item.dateOfSale).getMonth() === parseInt(month)
  );

  const priceRanges = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0,
  };

  filteredData.forEach((item) => {
    const price = parseFloat(item.price);
    const priceRange = categorizePrice(price);
    priceRanges[priceRange]++;
  });

  res.json(priceRanges);
};

module.exports.piechart = async (req, res, next) => {
  const { month } = req.query;
  const transactions = await transactionObject.find();
  const filteredData = transactions.filter(
    (item) => new Date(item.dateOfSale).getMonth() === parseInt(month)
  );
  const categoryCount = {};

  filteredData.forEach((item) => {
    const category = item.category;
    if (category in categoryCount) {
      categoryCount[category]++;
    } else {
      categoryCount[category] = 1;
    }
  });
  const result = Object.keys(categoryCount).map((category) => ({
    category,
    count: categoryCount[category],
  }));

  res.json(result);
};

module.exports.combinedApi = async (req, res, next) => {
  const { month } = req.query;

  try {
    const initializeDatabaseResponse = await axios.get(
      "http://localhost:3000/initialize-database"
    );
    const listTransactionsResponse = await axios.get(
      `http://localhost:3000/list-transactions?month=${month}`
    );
    const statisticsResponse = await axios.get(
      `http://localhost:3000/statistics?month=${month}`
    );

    const combinedResponse = {
      initializeDatabase: initializeDatabaseResponse.data,
      listTransactions: listTransactionsResponse.data,
      statistics: statisticsResponse.data,
    };

    res.json(combinedResponse);
    console.log(combinedResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch and combine data" });
  }
};
