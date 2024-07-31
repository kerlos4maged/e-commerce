const asynchandler = require("express-async-handler");

const ApiError = require("./api_error");
const ApiFeatures = require("./apiFeatures");


const deleteService = (modelDoc) => asynchandler(async (req, res, next) => {

    const {id} = req.params
    const item = await modelDoc.findByIdAndDelete({_id: id})
    if (item) {
        return res.status(200).json({message: "category deleted success", item})
    }
    next(new ApiError(`can't find the item please change ${id}`, 404))
})

// this is first solution to apply slugfiy when update and if used it need to set it on route
// const applySlug = (req, res, next) => {
//     req.body.slug = slugify(req.body.name)
//     next()
// }

const updateService = (modelDoc) => asynchandler(async (req, res, next) => {

    const item = await modelDoc.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (item) {
        return res.status(200).json({"status": "success", "document": item})
    }
    next(new ApiError(`can't find the item please change ${req.params.id}`, 404))
})

const getAllDocumentsService = (modelDoc, collectionName) => asynchandler(async (req, res, next) => {
    let subCategoryId = {}

    if (req.params.categoryId) subCategoryId = {category: req.params.categoryId}

    req.filterCategoryId = subCategoryId

    const docSize = await modelDoc.countDocuments()

    const apiFeaturesObj = new ApiFeatures(modelDoc.find(subCategoryId), req.query)
        .paginate(docSize)
        .filter()
        .search(collectionName)
        .fields()
        .sorting()

    const {buildQuery, paginationResult} = apiFeaturesObj

    const data = await buildQuery.exec()

    res.status(200).json({
        "Status": "Success",
        "PaginationResult": paginationResult,
        "Size": data.length,
        "result": data
    })
})

const createService = (modelDoc) => asynchandler(async (req, res, next) => {

    console.log(`apiServices message req.body -> ${req.body}`)

    const data = await modelDoc.create(req.body)
    console.log(`apiServices message data -> ${data} `)
    res.status(200).json({
        "Status": "Success",
        "result": data
    })

})

const getSpecificDocumentService = (modelDoc) => asynchandler(async (req, res, next) => {

    const {id} = req.params
    const item = await modelDoc.findById(id)
    // .populate({ path: 'category', select: 'name -_id' })

    console.log(`item data is -> ${id.length}`)

    if (!item) {
        // res.status(404).json({ message: "Category Not Found" })
        return next(new ApiError("Item Not Found", 404))
    }
    res.status(200).json({message: "success", data: item})

})

module.exports = {
    deleteService,
    updateService,
    getAllDocumentsService,
    createService,
    getSpecificDocumentService,
}