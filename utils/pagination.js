// utils/pagination.js

/**
 * Paginates a Sequelize model with dynamic options.
 *
 * @param {Object} params - Parameters for pagination.
 * @param {Object} params.model - The Sequelize model to paginate.
 * @param {number} [params.page=1] - Current page number.
 * @param {number} [params.limit=10] - Number of records per page.
 * @param {Object} [params.where={}] - Filtering conditions.
 * @param {Object} [params.options={}] - Additional Sequelize query options (e.g., include, order).
 *
 * @returns {Object} - Paginated result containing total items, total pages, current page, and data.
 */
module.exports.paginate = async ({ model, page = 1, limit = 10, where = {}, options = {} }) => {
    const offset = (page - 1) * limit;

    // Merge default ordering with any provided in options
    const order = options.order || [['createdAt', 'DESC']];

    // Construct the query options
    const queryOptions = {
        where,        // Filter conditions
        limit,        // Number of records per page
        offset,       // Records to skip
        order,        // Sorting order
        ...options,   // Spread any additional options (e.g., include)
    };

    try {
        // Execute the paginated query
        const { count, rows: data } = await model.findAndCountAll(queryOptions);

        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data,
        };
    } catch (error) {
        // Optionally, handle specific errors or rethrow
        throw error;
    }
};
