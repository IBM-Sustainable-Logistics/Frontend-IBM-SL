import {
    assertEquals,
} from "https://deno.land/std@0.221.0/testing/asserts.ts";
import {
    getFileSize,
    isValidFileSize,
} from "../../app/components/Upload/UploadFileTest.ts";

Deno.test("getFileSize (1MiB.txt) should return correct file size in bytes", async () => {
    const path = './test-files/1MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "1MiB.txt");
    assertEquals(getFileSize(file), 1048576);
});
Deno.test("isValidFileSize (1MiB.txt) should return true", async () => {
    const path = './test-files/1MiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "1MiB.txt");
    assertEquals(isValidFileSize(file), true);
});

Deno.test("getFileSize (20KiB.txt) should return correct file size in bytes", async () => {
    const path = './test-files/20KiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "20KiB.txt");
    assertEquals(getFileSize(file), 20480);
});
Deno.test("isValidFileSize (20KiB.txt) should return true", async () => {
    const path = './test-files/20KiB.txt';
    const readFileContent = await Deno.readFile(path); 

    const file = new File([readFileContent], "20KiB.txt");
    assertEquals(isValidFileSize(file), true);
});

// Use the following command to run the tests:
// deno test --allow-read --allow-net tests/unit/fileUploadSize.test.ts

