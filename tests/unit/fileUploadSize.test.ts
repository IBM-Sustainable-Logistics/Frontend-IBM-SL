import {
    assertEquals,
} from "https://deno.land/std@0.221.0/testing/asserts.ts";
import {
    getFileSize,
    isValidFileSize,
} from "../../app/components/Upload/UploadFileTest";
import testFile1MiB from '../test-files/1MiB.txt';
import testFile20KiB from '../test-files/20KiB.txt';

Deno.test("getFileSize should return correct file size in bytes", () => {
    var file = new File(testFile1MiB, "testFIle1MiB");
    assertEquals(getFileSize(file), 1048576);
});
Deno.test("isValidFileSize should return true", () => {
    var file = new File(testFile1MiB, "testFIle1MiB");
    assertEquals(isValidFileSize(file), true);
});

Deno.test("getFileSize should return correct file size in bytes", () => {
    var file = new File(testFile20KiB, "testFile20KiB");
    assertEquals(getFileSize(file), 20480);
});
Deno.test("isValidFileSize should return true", () => {
    var file = new File(testFile20KiB, "testFile20KiB");
    assertEquals(isValidFileSize(file), true);
});

// Use the following command to run the tests:
// deno test --allow-read --allow-net tests/unit/fileUploadSize.test.ts

