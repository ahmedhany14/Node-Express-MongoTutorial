class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {

        let filter = {...this.queryStr};
        const exc_params = ['page', 'sort', 'limit', 'fields'];
        exc_params.forEach(ele => delete filter[ele])
        filter = JSON.stringify(filter);
        filter = filter.replace(/\b(gte|gt|lt|lte)\b/g, match => {
            return `$${match}`;
        })

        this.query = this.query.find(JSON.parse(filter));
        return this;

    }

    sort() {
        let sortby = '-createdAt';
        if (this.queryStr.sort) sortby = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortby);
        return this;
    }

    limitRes() {
        if (this.queryStr.limit) this.query = this.query.limit(this.queryStr.limit);
        return this;
    }

    limitFields() {

        let fields = '-__v';
        if (this.queryStr.fields) fields = this.queryStr.fields.split(',').join(' ');
        console.log(fields)
        this.query = this.query.select(fields);
        return this;
    }

    pagination() {
        let page = 1, limit = 100;
        if (this.queryStr.page) page = parseInt(this.queryStr.page);
        if (this.queryStr.page && this.queryStr.limit) limit = parseInt(this.queryStr.limit);
        let skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeature;