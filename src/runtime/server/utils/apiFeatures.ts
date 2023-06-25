/**
 * APIFeatures class represents a utility for manipulating and filtering API queries.
 */
export class APIFeatures {
  /**
   * Create an instance of APIFeatures.
   * @param {any} query - The query object.
   * @param {object} queryString - The query string object.
   */
  constructor(public query: any, public queryString: object) {}

  /**
   * Filter the query based on the provided query string.
   * @returns {APIFeatures} The modified APIFeatures object.
   */
  filter(): APIFeatures {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete Object(queryObj)[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = Object(this.query).find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Perform a text search on the query using the provided search term.
   * @returns {APIFeatures} The modified APIFeatures object.
   */
  search(): APIFeatures {
    // console.log(Object(this.queryString));
    if (Object(this.queryString).search) {
      const search = Object(this.queryString).search;

      this.query = Object(this.query).find({
        $text: { $search: search as string },
      });
    }
    return this;
  }

  /**
   * Limit the fields returned in the query result.
   * @returns {APIFeatures} The modified APIFeatures object.
   */
  limitFields(): APIFeatures {
    if (Object(this.queryString).fields) {
      const fields = Object(this.queryString).fields.split(",").join(" ");
      this.query = Object(this.query).select(fields);
    } else {
      this.query = Object(this.query).select("-__v");
    }

    return this;
  }

  /**
   * Paginate the query result.
   * @returns {APIFeatures} The modified APIFeatures object.
   */
  paginate(): APIFeatures {
    const page = Object(this.queryString).page * 1 || 1;
    const limit = Object(this.queryString).limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = Object(this.query).skip(skip).limit(limit);

    return this;
  }

  /**
   * Sort the query result.
   * @returns {APIFeatures} The modified APIFeatures object.
   */
  sort(): APIFeatures {
    if (Object(this.queryString).sort) {
      const sortBy = Object(this.queryString).sort.split(",").join(" ");
      this.query = Object(this.query).sort(sortBy);
    } else {
      this.query = Object(this.query).sort({ _id: -1 });
    }

    return this;
  }
}
