import type { CategoryField } from '@/shared';

/**
 * Determines if two fields are paired (e.g., WorkTimeFrom/WorkTimeTo)
 */
export const isFieldPaired = (field1: CategoryField, field2: CategoryField): boolean => {
  const tag1 = field1.tag;
  const tag2 = field2.tag;

  // Check if they have the same prefix and one ends with 'From' and the other with 'To'
  if (tag1.endsWith('From') && tag2.endsWith('To')) {
    return tag1.slice(0, -4) === tag2.slice(0, -2); // Remove 'From' and 'To' and compare
  } else if (tag1.endsWith('To') && tag2.endsWith('From')) {
    return tag1.slice(0, -2) === tag2.slice(0, -4); // Remove 'To' and 'From' and compare
  }

  return false;
};

/**
 * Orders fields according to specific business rules:
 * - Required fields first, in specific order (Title, Description, Price, ImageUrls)
 * - Other required fields
 * - Optional fields
 * - Excludes specific fields that shouldn't be rendered
 */
export const getOrderedFields = (categoryFields: CategoryField[] | null): CategoryField[] => {
  if (!categoryFields) {
    return [];
  }

  // Filter out the Id field and the fields that shouldn't be rendered
  const fields = categoryFields.filter(
    (f) =>
      f.tag !== 'Id' &&
      f.tag !== 'Category' &&
      f.tag !== 'ServiceType' &&
      f.tag !== 'ServiceSubtype' &&
      f.tag !== 'AutoserviceServiceType' &&
      f.tag !== 'AvitoId' &&
      f.tag !== 'CallsDevices' &&
      f.tag !== 'Latitude' &&
      f.tag !== 'Longitude' &&
      f.tag !== 'Images' &&
      f.tag !== 'ImageNames' &&
      f.tag !== 'Promo' &&
      f.tag !== 'PromoAutoOptions' &&
      f.tag !== 'PromoManualOptions',
  );

  // Define the specific order for required fields
  const specificRequiredOrder = ['Title', 'Description', 'Price', 'ImageUrls'];

  // Separate fields into categories
  const specificRequiredFields: (CategoryField | undefined)[] = new Array(specificRequiredOrder.length);
  const otherRequiredFields: CategoryField[] = [];
  const optionalFields: CategoryField[] = [];

  fields.forEach((field) => {
    const isRequired = field.content && field.content[0] && field.content[0].required;

    if (isRequired) {
      const specificIndex = specificRequiredOrder.indexOf(field.tag);
      if (specificIndex !== -1) {
        // Add to specific required fields at the correct position
        specificRequiredFields[specificIndex] = field;
      } else {
        otherRequiredFields.push(field);
      }
    } else {
      optionalFields.push(field);
    }
 });

  // Filter out undefined values and combine in the required order
  const orderedSpecificRequired = specificRequiredOrder
    .map((tag) => specificRequiredFields[specificRequiredOrder.indexOf(tag)])
    .filter((field) => field !== undefined) as CategoryField[];

  // Combine all fields in the correct order
  return [...orderedSpecificRequired, ...otherRequiredFields, ...optionalFields];
};

/**
 * Calculates the total number of steps based on field grouping rules
 */
export const calculateTotalSteps = (orderedFields: CategoryField[]): number => {
  let stepCount = 0;
  let i = 0;

  while (i < orderedFields.length) {
    // Each step can have up to 2 fields, but paired fields should stay together
    let fieldsInStep = 1;

    // Check if the current field is part of a pair and if the next field is its pair
    if (i + 1 < orderedFields.length) {
      const currentField = orderedFields[i];
      const nextField = orderedFields[i + 1];

      // Check if these are paired fields (e.g., WorkTimeFrom/WorkTimeTo)
      const isPaired = isFieldPaired(currentField, nextField);
      if (isPaired) {
        fieldsInStep = 2;
      } else if (i + 2 < orderedFields.length) {
        // Check if current field and the one after next are paired
        const nextNextField = orderedFields[i + 2];
        const isCurrentPairedWithNextNext = isFieldPaired(currentField, nextNextField);
        if (isCurrentPairedWithNextNext) {
          fieldsInStep = 1; // Current field will be in a step with the one after next
        } else {
          fieldsInStep = 2; // Take up to 2 fields if not paired
        }
      } else {
        fieldsInStep = 2; // Take up to 2 fields if not paired
      }
    }

    stepCount++;
    i += fieldsInStep;
  }

  return stepCount;
};