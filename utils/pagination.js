// utils/pagination.js
module.exports.paginate = async (model, page = 1, limit = 10, where = {}, order = [['createdAt', 'DESC']]) => {
    const offset = (page - 1) * limit;

    // Use findAndCountAll to get total count and paginated data
    const { count, rows: data } = await model.findAndCountAll({
        where,  // Filter conditions
        limit,  // Number of records per page
        offset, // Skip records for previous pages
        order,  // Sorting order
    });

    return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data,
    };
};
