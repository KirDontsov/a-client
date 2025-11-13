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