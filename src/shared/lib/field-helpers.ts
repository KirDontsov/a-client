/**
 * Checks if a field is a date field based on its tag or data type
 */
export const isDateField = (field: any): boolean => {
  // Check if field tag contains date-related words or if data type is date
  const tag = field.tag.toLowerCase();
  const dataType = field.content[0].data_type?.toLowerCase() || '';

  return (
    tag.includes('date') ||
    tag.includes('beg') ||
    tag.includes('end') ||
    dataType.includes('date') ||
    dataType.includes('time')
  );
};

/**
 * Processes select options from field values, handling different structures
 */
export const getSelectOptions = (values: any) => {
  // Check if values is an object with a nested values array (like WorkTimeFrom/To fields)
  if (values && typeof values === 'object' && Array.isArray(values.values)) {
    return values.values;
  }
  // Otherwise, assume it's a regular array
  return Array.isArray(values) ? values : [];
};

/**
 * Checks if Make field has the new structure with nested values
 */
export const isMakeFieldWithNewStructure = (field: any): boolean => {
  // Check if field is Make and has the new structure where values is an object with a values array
  return (
    field.tag === 'Make' &&
    field.content &&
    field.content[0] &&
    field.content[0].values &&
    typeof field.content[0].values === 'object' &&
    Array.isArray(field.content[0].values.values)
  );
};

/**
 * Finds matching Avito category by checking if category names match field values level by level
 * Returns the avito_slug if a matching category is found
 */
export const findMatchingCategory = (adFields: any[], categoriesTree: any[]): string | null => {
  if (!adFields || !Array.isArray(adFields) || !categoriesTree || !Array.isArray(categoriesTree)) {
    return null;
  }

  // Create an array of all available field values
  const allFieldValues = [];

  for (const field of adFields) {
    if (field.tag && field.values && field.values.length > 0) {
      allFieldValues.push({ tag: field.tag, value: field.values[0].value });
    }
  }

  // Start checking from level 0 nested values (the nested categories of top-level categories)
  for (const topCategory of categoriesTree) {
    if (topCategory.nested && topCategory.nested.length > 0) {
      const result = findMatchAtLevel(topCategory.nested, allFieldValues);
      if (result) {
        return result;
      }
    }
  }

  console.log('No matching category path found');
  return null;
};

/**
 * Looks for a match at the current level and then recursively dives deeper
 */
function findMatchAtLevel(categories: any[], fieldValues: { tag: string; value: string }[]): string | null {
  // Look for a match at the current level among all field values
  for (const category of categories) {
    for (const { tag, value } of fieldValues) {
      if (category.name && category.name.toLowerCase().trim() === value.toLowerCase().trim()) {
        // If there are nested categories, dive deeper recursively
        if (category.nested && category.nested.length > 0) {
          // Create a new list of remaining field values (excluding the one we just matched)
          const remainingFieldValues = fieldValues.filter((field) => field.value !== value);

          // If there are remaining field values, continue looking for matches in nested categories
          if (remainingFieldValues.length > 0) {
            const nextLevelResult = findMatchAtLevel(category.nested, remainingFieldValues);
            if (nextLevelResult) {
              return nextLevelResult;
            }
          }
        }

        return category.slug || null;
      }
    }
  }

  // If no match found at this level, return null
  return null;
}
