export const extractErrorMessage = (error: any): string => {
  const data = error?.response?.data;

  if (!data) return "Something went wrong";

  if (data.errors) {
    const getErrorWithKey = (errObj: any, parentKey = ""): any => {
      if (Array.isArray(errObj)) {
        return getErrorWithKey(errObj[0], parentKey);
      }

      if (typeof errObj === "object") {
        const firstKey = Object.keys(errObj)[0];
        return getErrorWithKey(errObj[firstKey], firstKey);
      }

      if (typeof errObj === "string") {
        return {
          key: parentKey,
          message: errObj
        };
      }

      return null;
    };

    const result = getErrorWithKey(data.errors);

    if (result) {
      if (!result.key) return result.message;

      const formattedKey =
        result.key.charAt(0).toUpperCase() +
        result.key.slice(1).replace(/_/g, " ");

      return `${formattedKey}: ${result.message}`;
    }
  }

  // Fallback to standard message fields
  return data.message || data.error || data.detail || "Something went wrong";
};
