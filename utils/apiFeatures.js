class ApiFeatures {
    // eslint-disable-next-line no-unused-vars,no-useless-constructor
    constructor(buildQuery, queryString) {
        this.buildQuery = buildQuery;
        this.queryString = queryString;
    }

    filter() {
        //1- filter data
        const queryAfterDestruct = { ...this.queryString };
        const excludes = ['sort', 'page', 'limit', 'fields']
        excludes.forEach((item) => delete queryAfterDestruct[item])

        // need to change the request from object to string for make some of regex on it

        // so first -> change from object to string values
        let query = JSON.stringify(queryAfterDestruct)
        // second -> change value using regx -> select all values on the request /g for select if you have more than one \b for select
        query = query.replace(/\b(gte|gt|lte|lt)\b/g, matchValue => `$${matchValue}`)
        // third -> convert it again to json object
        query = JSON.parse(query)
        // console.log(queryString)
        this.buildQuery = this.buildQuery.find(query)

        return this
    }

    sorting() {
        if (this.queryString.sort) {
            // sorting ascending is + , descending -
            const querySorting = this.queryString.sort.split(",").join(" ")
            // if you will sort about two fields need to
            this.buildQuery = this.buildQuery.sort(querySorting)
        } else {
            this.buildQuery = this.buildQuery.sort('-createdAt')
        }
        return this
    }

    fields() {
        if (this.queryString.fields) {
            const items = this.queryString.fields.split(',').join(' ')
            this.buildQuery = this.buildQuery.select(items)
        } else {
            // her will remove __v field mongo create it for you
            this.buildQuery = this.buildQuery.select('-__v')
        }
        return this
    }

    search(model) {
        console.log(`this is message from apiFeatures and this is value for model ${model}`)
        if (this.queryString.keywords) {
            let query = {}
            if (model === "Product") {
                console.log(`we going to brand search and this is your query ${JSON.stringify(this.queryString.keywords)} `)

                query.$or = [
                    { title: { $regex: this.queryString.keywords, $options: 'i' } },
                    { description: { $regex: this.queryString.keywords, $options: 'i' } }
                ]
                console.log(`this is value return from keywords ${JSON.stringify(query)}`)
            } else {
                console.log(`we going to brand search and this is your query ${JSON.stringify(this.queryString.keywords)} `)

                query = { name: { $regex: this.queryString.keywords, $options: 'i' } }

                console.log(`this is value return from keywords ${JSON.stringify(query)}`)
            }
            console.log(`this is message after everything ${JSON.stringify(this.queryString.keywords)} `)
            this.buildQuery = this.buildQuery.find(query)
        }

        return this
    }

    paginate(countDocuments) {
        console.log(`paginate ${countDocuments}`)
        
        const paginationObj = {}

        const page = parseInt(this.queryString.currentPage, 10) || 1;

        const limit = parseInt(this.queryString.limit, 10) || 5;

        const skip = (page - 1) * limit

        this.buildQuery = this.buildQuery.limit(limit).skip(skip)

        // calc all pages you have on your db  -> allDocument / limit -> value , 50 document in data base / 5 limit -> 10 pages
        // 1- get all document in constractor
        // 2- calc pages

        // parseInt move to smallest value from current value
        // const allPages = parseInt(countDocuments / limit, 10)

        // Math.ceil move to biggest value from current value
        const allPages = Math.ceil(countDocuments / limit)

        // calc next page -> if (current page + 1 >= AllPage) nextPage = currentPage+1

        // first way ->

        //1- let nextPage
        let nextPage = 0
        // 2- set nextPageValue if allPages still smaller thant page + 1 -> ex: currentPage = 2, allPages = 5 -> currentPage +1 <= allPages ? soo will add one
        nextPage = page + 1 <= allPages ? page + 1 : nextPage

        // second way ->
        // 1- calc the end index this is check if you moved to last item in database -> ex: limit = 2 , page =5 -> 2*5 = 10 and CountDocument in Data Base is 10 so this is end
        // const checkIndex = limit * page
        //
        // if (checkIndex < countDocuments) {
        //     paginationObj.nextPages = page + 1
        // }

        // calc previous page

        // first way ->

        // if (skip > 0) {
        //     paginationObj.previousPages = page - 1
        // }

        // second way ->
        let previousPage = 0

        previousPage = page - 1 >= 0 ? page - 1 : previousPage

        paginationObj.currentPage = page
        paginationObj.limit = limit
        paginationObj.allPages = allPages
        paginationObj.nextPages = nextPage
        paginationObj.previousPages = previousPage
        paginationObj.DataSize = countDocuments
        this.paginationResult = paginationObj

        return this
    }
}

module.exports = ApiFeatures