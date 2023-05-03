//for pagination
const DEFAULT_PAGE_NUMBER = 1;
const  DEFAULT_LIMIT = 10;

function getPagination(query) {
    const limit = Math.abs(query.limit);
    const page = Math.abs(query.page);
    const skip = (page -1) * limit;

    return {
        skip,
        limit,
    }
    //provides an object that can be used to paginate with mongodb queries.
}

module.exports = {
    getPagination,
}