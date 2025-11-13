import { File } from "node:buffer";   
import { describe, it, expect } from "vitest";
import { isSupportedImage } from "./imageValidator";



const TEST_FILE_INPUTS = [
  // types allowed 
  ["image/jpeg", true],
  ["image/jpg", true],
  ["image/png", true],
  ["image/gif", true],
  

  // types not allowed 
  ["text/plain", false], 
  
  ["application/pdf", false],
  ["image/webp", false],    
  ["video/mp4", false],
  ["", false],              
  ["image/avif", false],    
];


describe("isSupportedImage File Type Validation", () => {
  
  it.each(TEST_FILE_INPUTS)(
    "should return %s for MIME type %s",
    (type, expected) => {
      const fileName = `test.${type.split('/')[1] || 'file'}`;
      const dummyFile = new File(["dummy content"], fileName, { type });

      const result = isSupportedImage(dummyFile);

      expect(result).toBe(expected);
      
    }
  );

  // Additional test for non-file inputs
  it("should return false for null or undefined input", () => {
    expect(isSupportedImage(null)).toBe(false);
    expect(isSupportedImage(undefined)).toBe(false);
  });
});