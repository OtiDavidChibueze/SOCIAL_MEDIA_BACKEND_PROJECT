//  SOCIAL MEDIA SCHEMA VALIDATION HELPER
import ResponseHelper from "../util/responseHelper.mjs";

class SchemaValidation {
  /**
   * @description - THIS VALIDATE  THE INPUT
   * @param {object} schema - THE PROVIDED SCHEMA
   * @param {object} object - THE OBJECT THE VALIDATION SHOULD TAKE PLACE
   * @returns - RETURNS A BOOLEAN
   * @memberof SchemaValidation
   */
  static async validateInput(schema, object) {
    const { error, value } = schema.validate(object);
    return { error, value };
  }

  /**
   * @description - THIS VALIDATE  THE SCHEMA
   * @param {object} schema - THE PROVIDED SCHEMA
   * @returns - RETURNS A JSON MESSAGE
   * @memberof SchemaValidation
   */
  static async validateSchema(schema) {
    return (req, res, next) => {
      const { error } = SchemaValidation.validateInput(schema, {
        ...req.body,
        ...req.query,
      });

      if (!error) {
        return next();
      }

      ResponseHelper.errorResponse(res, 422, error.details[0].message);
    };
  }
}

export default SchemaValidation;
