const asynchandler = require("express-async-handler");

const ApiError = require("./api_error");
const ApiFeatures = require("./apiFeatures");


const deleteService = (Model) =>
    asynchandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        // Trigger "remove" event when update document
       
        document.deleteOne();

        res.status(202).send({ message: 'Document deleted successfully', Document: document });
    });

// this is first solution to apply slugfiy when update and if used it need to set it on route
// const applySlug = (req, res, next) => {
//     req.body.slug = slugify(req.body.name)
//     next()
// }

const updateService = (modelDoc) => asynchandler(
    async (req, res, next) => {

        const item = await modelDoc.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!item) {
            next(new ApiError(`can't find the item please change ${req.params.id}`, 404))
        }
        // item.save -> this is method will worked before trigger save on model 
        // item.init()
        item.save()
        return res.status(200).json({ "status": "success", "document": item })
    })

const getAllDocumentsService = (modelDoc, collectionName) => asynchandler(async (req, res, next) => {
    /*
     * steps to get data for nested routes -> 
     * in all nested routes like subCategory (subCategory_controller), review (review_controller)
     * we used middleware called setId value from params to -> will send from request in parent 
     * so -> we get this parentId and set in object called (filterById) 
     * and last step -> check if this filterById exists so it means -> (we used nested search) 
     */

    let nestedRouteId = {}

    if (req.filterById) nestedRouteId = req.filterById

    console.log(`this is message from apiService file and this is filterById value: ${JSON.stringify(nestedRouteId)}`)

    const docSize = await modelDoc.find(nestedRouteId).countDocuments()

    // console.log(`this is message from apiService file and this is docSize value: ${modelDoc} & ${collectionName}`)

    const apiFeaturesObj = new ApiFeatures(modelDoc.find(nestedRouteId), req.query)
        .paginate(docSize)
        .filter()
        .search(collectionName)
        .fields()
        .sorting()

    const { buildQuery, paginationResult } = apiFeaturesObj

    const data = await buildQuery.exec()

    res.status(200).json({
        "Status": "Success",
        "PaginationResult": paginationResult,
        "Size": data.length,
        "result": data
    })
})

const createService = (modelDoc) =>
    asynchandler(async (req, res) => {
        const data = await modelDoc.create(req.text)
        res.status(200).json({
            "Status": "Success",
            "result": data
        })

    })


const getSpecificDocumentService = (modelDoc, populateOption) =>
    asynchandler(async (req, res, next) => {

        // this is i think in it and create it 
        // when we search on nested route and need to return review depending on user (user id = value)  need to check
        // so ex: -> {{url}}/api/v1/product/66ba0dd55955388e2a2d6515/review/66d5bdd064ebebb1132506c2
        // id review in this case related to this product but, if i change this review id will return because -> search only in review collection by id 
        // so i set filed in request called filterById -> this is filed set if request have an (productId)
        let searchQuery = {}

        if (req.filterById) {
            console.log('we moved to filterById condition return true')
            searchQuery = req.filterById
        }
        else {
            console.log('we moved to else condition return false')
            searchQuery._id = req.params.id
        }

        let query = modelDoc.findOne(searchQuery)

        if (populateOption) {
            query = query.populate(populateOption)
        }
        const item = await query
        // console.log(`item data is -> ${id.length}`)

        if (!item) {
            // res.status(404).json({ message: "Category Not Found" })
            return next(new ApiError("Item Not Found", 404))
        }
        res.status(200).json({ message: "success", data: item })

    })

module.exports = {
    deleteService,
    updateService,
    getAllDocumentsService,
    createService,
    getSpecificDocumentService,
}