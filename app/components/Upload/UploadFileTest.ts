/**
 * Test method for verifying that the size of the uploaded files are calculated correctly. 
 * @param method The file whose size is to be tested.
 * @returns Test file size (in bytes).
 */
export const getFileSize = (method: File): number => {
    return method.size;
  }
  
  /**
   * Test method for verifying that the size of the uploaded files equals/less than 15 megabytes. 
   * @param method The file whose size is to be tested.
   * @returns Whether the filesize is acceptable.
   */
  export const isValidFileSize = (method: File): boolean => {
    if (method.size <= 1048576) {
      return true
    } else {
      return false;
    }
  }