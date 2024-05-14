import {
    assertEquals,
} from "https://deno.land/std@0.221.0/testing/asserts.ts";
import {
    testGetFileSize,
    testIsValidFileSize,
} from "../../app/components/Upload/UploadFileTest.ts";

Deno.test("getFileSize (1MiB.txt) should return correct file size in bytes", async () => {
    const path = './test-files/1MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "1MiB.txt");
    assertEquals(testGetFileSize(file), 1048576);
});
Deno.test("isValidFileSize (1MiB.txt) should return true", async () => {
    const path = './test-files/1MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "1MiB.txt");
    assertEquals(testIsValidFileSize(file), true);
});

Deno.test("getFileSize (20KiB.txt) should return correct file size in bytes", async () => {
    const path = './test-files/20KiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "20KiB.txt");
    assertEquals(testGetFileSize(file), 20480);
});
Deno.test("isValidFileSize (20KiB.txt) should return true", async () => {
    const path = './test-files/20KiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "20KiB.txt");
    assertEquals(testIsValidFileSize(file), true);
});

Deno.test("getFileSize (16MiB.txt) should return correct file size in bytes", async () => {
    const path = './test-files/16MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "16MiB.txt");
    assertEquals(testGetFileSize(file), 16777216);
});
Deno.test("isValidFileSize (16MiB.txt) should return false", async () => {
    const path = './test-files/16MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "16MiB.txt");
    assertEquals(testIsValidFileSize(file), false);
});

// Use the following command to run the tests:
// deno test --allow-read --allow-net tests/unit/fileUploadSize.test.ts

