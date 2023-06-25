import Validator from "./validator";
import Authorizer from "./authorizer";
import ResourceHelper from "./resourceHelper";

export { APIFeatures } from "./apiFeatures";
export { allows } from "./checkAuthority";
export {
  indexRecourceHelper,
  showResourceHelper,
  deleteResourceHelper,
} from "./resourceUtility";

export { validateSchema } from "./validateSchema";

/**
 * TODO: Refactor all the utils with proper names
 * TODO: validateSchema should be a member of Validator class
 * TODO: allows should be a member of Authority class
 * TODO: indexRecourceHelper should be a member of Resource class
 * TODO: showResourceHelper should be a member of Resource class
 * TODO: deleteResourceHelper should be a member of Resource class
 * TODO: Add mongodb nitro plugin
 * TODO: Add more utils
 */

export { Validator, Authorizer, ResourceHelper };
