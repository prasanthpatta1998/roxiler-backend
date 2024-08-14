const {initialize_db,statistics,barchart,piechart,combinedApi, transactions}=require("../controllers/transactionController.jsx")
const router=require("express").Router()


router.get("/initialize-database",initialize_db)
router.get("/list-transactions",transactions)
router.get("/statistics",statistics)
router.get("/bar-chart",barchart)
router.get("/pie-chart-api",piechart)
router.get("/combined-api",combinedApi)

module.exports = router;