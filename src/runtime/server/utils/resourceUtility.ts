import {
  H3Event,
  EventHandler,
  getRouterParam,
  sendError,
  createError,
  getQuery,
} from "h3";
import { Model, PopulateOptions } from "mongoose";
import { APIFeatures } from "./apiFeatures";

export interface indexRecourceHelperOptions<T> {
  model: Model<T>;
  related?: PopulateOptions[] | ((event: H3Event) => PopulateOptions[]);
  beforeFnHook?: (event: H3Event) => void;
  afterFnHook?: (
    event: H3Event,
    response: { totalPage: number; totalRecords: number; records: T[] }
  ) => void;
}

/**
 * REST API helper function to get all documents from a collection
 * @template T - The type of data being indexed.
 * @deprecated since version 0.0.6
 * @param {indexRecourceHelperOptions<T>} options - Options for indexing.
 * @param {Model<T>} options.model - The model used for indexing.
 * @param {PopulateOptions[] | ((event: H3Event) => PopulateOptions[])} [options.related] - Options for populating related data or a function that returns options based on an event.
 * @param {(event: H3Event) => void} [options.beforeFnHook] - Hook function to be executed before indexing.
 * @param {(event: H3Event, response: { totalPage: number; totalRecords: number; records: T[] }) => void} [options.afterFnHook] - Hook function to be executed after indexing, receives the event and the indexing response.
 * @returns void
 */
export const indexRecourceHelper = <T>(
  options: indexRecourceHelperOptions<T>
) => {
  return async (event: H3Event) => {
    const { model, related, beforeFnHook, afterFnHook } = options;

    // Run before function hook
    if (beforeFnHook) {
      beforeFnHook(event);
    }

    // Get the extra query from the event context
    const extraQuery = event.context.extraQuery || {};

    // Get the query from the event
    const query: {
      [key: string]: any;
    } = getQuery(event);

    // Set the default limit
    if (!query.limit) {
      query.limit = 10;
    }

    // create mongo query
    const mongoQuery = model.find(extraQuery);

    // Populate related models
    if (related) {
      if (typeof related === "function") {
        mongoQuery.populate(related(event));
      } else {
        related.forEach((relation) => {
          mongoQuery.populate(relation);
        });
      }
    }

    // Create APIFeatures instance
    const apiFeature = new APIFeatures(mongoQuery, query);
    apiFeature.filter().sort().limitFields().paginate().search();
    const records = await apiFeature.query;

    // Create APIFeatures instance for count
    const recordsCount = new APIFeatures(model.find(extraQuery), query)
      .filter()
      .search();
    const count = await recordsCount.query.countDocuments();

    // Run after function hook
    if (afterFnHook) {
      afterFnHook(event, {
        totalPage: Math.ceil(count / query.limit),
        totalRecords: count,
        records,
      });
    }

    // Return the response
    return {
      totalPage: Math.ceil(count / query.limit),
      totalRecords: count,
      records,
    };
  };
};

export interface ShowResourceHelperOptions<T> {
  model: Model<T>;
  related?: PopulateOptions[] | ((event: H3Event) => PopulateOptions[]);
}

/**
 * REST API helper function to get a single document from a collection
 * @deprecated since version 0.0.6
 * @template T - The type of data being shown.
 * @param {ShowResourceHelperOptions<T>} options - Options for showing.
 * @param {Model<T>} options.model - The model used for showing.
 * @param {PopulateOptions[] | ((event: H3Event) => PopulateOptions[])} [options.related] - Options for populating related data or a function that returns options based on an event.
 * @returns void
 * @throws {Error} If no document is found
 * @throws {Error} If the id is not a valid ObjectId
 * @throws {Error} If the id is not found
 * @example
showResourceHelper({
model: UserModel
});
*/
export const showResourceHelper = <T>(
  options: ShowResourceHelperOptions<T>
) => {
  return async (event: H3Event) => {
    const { model, related } = options;

    const id = getRouterParam(event, "id");

    // create mongo query
    const mongoQuery = model.findById(id);

    // Populate related models
    if (related) {
      if (typeof related === "function") {
        mongoQuery.populate(related(event));
      } else {
        related.forEach((relation) => {
          mongoQuery.populate(relation);
        });
      }
    }

    const resource = await mongoQuery;

    if (!resource) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Not Found",
          data: {
            message: `No ${model.collection.name} found with id: ${id}`,
          },
        })
      );
    }

    return resource;
  };
};

type Integrity = {
  model: Model<any>;
  localField?: string;
  foreignField: string;
};

interface DeleteResourceHelperOptions<T> {
  model: Model<T>;
  intigrity?: Integrity[];
  checkSelf?: boolean;
  afterFnHook?: (event: H3Event, resource?: T) => Promise<void>;
}

/**
 * REST API helper function to get a single document from a collection
 * @deprecated since version 0.0.6
 * @template T - The type of data being deleted.
 * @param {DeleteResourceHelperOptions<T>} options - Options for deleting.
 * @param {Model<T>} options.model - The model used for deleting.
 * @param {Integrity[]} [options.intigrity] - Related collections to check for relations before deleting.
 * @param {boolean} [options.checkSelf] - Check if the id is the logged in user.
 * @param {(event: H3Event, resource?: T) => Promise<void>} [options.cb] - Callback function to run after deleting the resource.
 * @returns void
 * @throws {Error} If the id is not a valid ObjectId
 * @throws {Error} If the id is not found
 * @example
 * deleteResourceHelper({
 * model: UserModel
 * });
 */
export const deleteResourceHelper =
  <T>(options: DeleteResourceHelperOptions<T>): EventHandler =>
  async (event: H3Event) => {
    const { model, intigrity, checkSelf, afterFnHook } = options;
    const id = getRouterParam(event, "id");

    // Check the id is not the logged in user
    if (checkSelf) {
      if (event.context.auth.user.id === id) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
              message: "You cannot delete yourself",
            },
          })
        );
      }
    }

    // Check for Relation in collection
    if (intigrity) {
      for (const relation of intigrity) {
        const record = await relation.model.findOne({
          [relation.foreignField]: id,
        });

        if (record) {
          return sendError(
            event,
            createError({
              statusCode: 400,
              statusMessage: "Bad Request",
              data: {
                message: `This ${model.collection.name} is related to ${relation.model.collection.name}`,
              },
            })
          );
        }
      }
    }

    const resource = await model.findByIdAndDelete(id);
    if (!resource) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Not Found",
          data: {
            message: `No ${model.collection.name} found with id: ${id}`,
          },
        })
      );
    }

    if (afterFnHook) {
      await afterFnHook(event, resource);
    }

    //  Set a status code
    event.node.res.statusCode = 204;
    return {};
  };
